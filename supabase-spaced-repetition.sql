-- =====================================================
-- SPACED REPETITION SYSTEM DATABASE SCHEMA
-- Based on SM-2 Algorithm (SuperMemo) 
-- For IELTS Vocabulary Learning Platform
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER REVIEWS TABLE
-- Tracks individual flashcard review sessions
-- =====================================================
CREATE TABLE user_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  
  -- Review session data
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  -- SM-2 Quality ratings:
  -- 0: Complete blackout, no recall
  -- 1: Incorrect response with correct answer being familiar  
  -- 2: Incorrect response with correct answer seeming easy to remember
  -- 3: Correct response recalled with serious difficulty
  -- 4: Correct response after hesitation
  -- 5: Perfect response, immediate recall
  
  response_time_ms INTEGER, -- Time taken to respond in milliseconds
  
  -- SM-2 Algorithm specific fields
  easiness_factor DECIMAL(4,2) NOT NULL DEFAULT 2.5,
  -- EF (Easiness Factor): 1.3 - 2.5, represents how easy the card is
  
  interval_days INTEGER NOT NULL DEFAULT 1,
  -- Current interval between reviews in days
  
  repetition_number INTEGER NOT NULL DEFAULT 0,
  -- How many times this card has been successfully reviewed
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. USER STATS TABLE  
-- Tracks overall learning progress and statistics
-- =====================================================
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Daily/Session stats
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Review counts
  cards_reviewed INTEGER DEFAULT 0,
  cards_learned INTEGER DEFAULT 0, -- First time seeing the card
  cards_relearned INTEGER DEFAULT 0, -- Failed cards being relearned
  cards_correct INTEGER DEFAULT 0,
  cards_incorrect INTEGER DEFAULT 0,
  
  -- Time tracking
  total_study_time_ms INTEGER DEFAULT 0,
  average_response_time_ms INTEGER DEFAULT 0,
  
  -- Streaks and achievements
  daily_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  -- Performance metrics
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage correct
  cards_due_tomorrow INTEGER DEFAULT 0,
  
  -- IELTS specific progress
  words_mastered_by_band JSONB DEFAULT '{}', -- {"band_5": 120, "band_6": 80}
  study_goals JSONB DEFAULT '{}', -- {"daily_target": 50, "weekly_target": 300}
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per day
  UNIQUE(date)
);

-- =====================================================
-- 3. CARD SCHEDULING TABLE
-- Manages when each card should be reviewed next
-- =====================================================
CREATE TABLE card_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign keys
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  
  -- Scheduling information
  next_review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_interval_days INTEGER NOT NULL DEFAULT 1,
  current_easiness_factor DECIMAL(4,2) NOT NULL DEFAULT 2.5,
  current_repetition_number INTEGER NOT NULL DEFAULT 0,
  
  -- Card state in learning system
  card_state VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (
    card_state IN ('new', 'learning', 'review', 'relearning', 'suspended', 'mastered')
  ),
  -- new: Never studied
  -- learning: In initial learning phase (< 4 successful reviews)
  -- review: In long-term review cycle
  -- relearning: Failed and being relearned
  -- suspended: Manually suspended by user
  -- mastered: Achieved mastery level (EF > 2.8, interval > 30 days)
  
  -- Learning progress
  consecutive_correct INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_lapses INTEGER DEFAULT 0, -- Times the card was forgotten
  
  -- Performance tracking
  average_quality DECIMAL(3,2) DEFAULT 0.00,
  fastest_response_ms INTEGER,
  slowest_response_ms INTEGER,
  
  -- Metadata
  first_studied_at TIMESTAMP WITH TIME ZONE,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one schedule per flashcard
  UNIQUE(flashcard_id)
);

-- =====================================================
-- 4. STUDY SESSIONS TABLE
-- Tracks complete study sessions for analytics
-- =====================================================
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Session information
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_duration_ms INTEGER,
  
  -- Session results
  cards_studied INTEGER DEFAULT 0,
  new_cards INTEGER DEFAULT 0,
  review_cards INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  
  -- Session type
  session_type VARCHAR(20) DEFAULT 'mixed' CHECK (
    session_type IN ('new_cards', 'reviews', 'mixed', 'cram', 'test')
  ),
  
  -- Focus area (optional)
  lesson_focus UUID REFERENCES lessons(id),
  difficulty_focus INTEGER, -- 1-5 difficulty level focus
  
  -- Performance metrics
  accuracy_rate DECIMAL(5,2),
  average_response_time_ms INTEGER,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ACHIEVEMENT PROGRESS TABLE
-- Tracks user progress towards achievements/badges
-- =====================================================
CREATE TABLE achievement_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Achievement information
  achievement_type VARCHAR(50) NOT NULL,
  -- Types: 'daily_streak', 'cards_mastered', 'perfect_session', 
  --        'speed_demon', 'vocabulary_explorer', 'ielts_ready', etc.
  
  achievement_name VARCHAR(100) NOT NULL,
  achievement_description TEXT,
  
  -- Progress tracking
  current_progress INTEGER DEFAULT 0,
  target_progress INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Achievement metadata
  badge_icon VARCHAR(50), -- Emoji or icon identifier
  badge_color VARCHAR(20), -- Color theme
  points_awarded INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint per achievement type
  UNIQUE(achievement_type, achievement_name)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User Reviews indexes
CREATE INDEX idx_user_reviews_flashcard_id ON user_reviews(flashcard_id);
CREATE INDEX idx_user_reviews_reviewed_at ON user_reviews(reviewed_at);
CREATE INDEX idx_user_reviews_quality ON user_reviews(quality);

-- Card Schedule indexes  
CREATE INDEX idx_card_schedule_next_review ON card_schedule(next_review_date);
CREATE INDEX idx_card_schedule_state ON card_schedule(card_state);
CREATE INDEX idx_card_schedule_flashcard_id ON card_schedule(flashcard_id);

-- User Stats indexes
CREATE INDEX idx_user_stats_date ON user_stats(date);
CREATE INDEX idx_user_stats_daily_streak ON user_stats(daily_streak);

-- Study Sessions indexes
CREATE INDEX idx_study_sessions_start ON study_sessions(session_start);
CREATE INDEX idx_study_sessions_type ON study_sessions(session_type);

-- Achievement Progress indexes
CREATE INDEX idx_achievement_progress_type ON achievement_progress(achievement_type);
CREATE INDEX idx_achievement_progress_completed ON achievement_progress(is_completed);

-- =====================================================
-- FUNCTIONS FOR SM-2 ALGORITHM
-- =====================================================

-- Function to calculate next review date using SM-2 algorithm
CREATE OR REPLACE FUNCTION calculate_next_review(
  p_quality INTEGER,
  p_current_ef DECIMAL(4,2),
  p_current_interval INTEGER,
  p_repetition_number INTEGER
) RETURNS TABLE(
  new_ef DECIMAL(4,2),
  new_interval INTEGER,
  new_repetition INTEGER,
  next_review TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_new_ef DECIMAL(4,2);
  v_new_interval INTEGER;
  v_new_repetition INTEGER;
BEGIN
  -- Calculate new Easiness Factor using SM-2 formula
  v_new_ef := p_current_ef + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02));
  
  -- EF should be at least 1.3
  IF v_new_ef < 1.3 THEN
    v_new_ef := 1.3;
  END IF;
  
  -- If quality < 3, reset learning (failed card)
  IF p_quality < 3 THEN
    v_new_repetition := 0;
    v_new_interval := 1;
  ELSE
    v_new_repetition := p_repetition_number + 1;
    
    -- Calculate new interval based on SM-2 algorithm
    IF v_new_repetition = 1 THEN
      v_new_interval := 1;
    ELSIF v_new_repetition = 2 THEN
      v_new_interval := 6;
    ELSE
      v_new_interval := CEIL(p_current_interval * v_new_ef);
    END IF;
  END IF;
  
  -- Return calculated values
  RETURN QUERY SELECT 
    v_new_ef,
    v_new_interval,
    v_new_repetition,
    (NOW() + INTERVAL '1 day' * v_new_interval)::TIMESTAMP WITH TIME ZONE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update card_schedule when a review is recorded
CREATE OR REPLACE FUNCTION update_card_schedule_after_review()
RETURNS TRIGGER AS $$
DECLARE
  v_schedule_record RECORD;
  v_sm2_result RECORD;
BEGIN
  -- Get current schedule for the flashcard
  SELECT * INTO v_schedule_record 
  FROM card_schedule 
  WHERE flashcard_id = NEW.flashcard_id;
  
  -- If no schedule exists, create one
  IF v_schedule_record IS NULL THEN
    INSERT INTO card_schedule (flashcard_id, first_studied_at) 
    VALUES (NEW.flashcard_id, NEW.reviewed_at);
    
    SELECT * INTO v_schedule_record 
    FROM card_schedule 
    WHERE flashcard_id = NEW.flashcard_id;
  END IF;
  
  -- Calculate new values using SM-2 algorithm
  SELECT * INTO v_sm2_result FROM calculate_next_review(
    NEW.quality,
    v_schedule_record.current_easiness_factor,
    v_schedule_record.current_interval_days,
    v_schedule_record.current_repetition_number
  );
  
  -- Update card schedule
  UPDATE card_schedule SET
    next_review_date = v_sm2_result.next_review,
    current_interval_days = v_sm2_result.new_interval,
    current_easiness_factor = v_sm2_result.new_ef,
    current_repetition_number = v_sm2_result.new_repetition,
    last_reviewed_at = NEW.reviewed_at,
    total_reviews = total_reviews + 1,
    consecutive_correct = CASE 
      WHEN NEW.quality >= 3 THEN consecutive_correct + 1 
      ELSE 0 
    END,
    total_lapses = CASE 
      WHEN NEW.quality < 3 THEN total_lapses + 1 
      ELSE total_lapses 
    END,
    card_state = CASE
      WHEN NEW.quality < 3 THEN 'relearning'
      WHEN v_sm2_result.new_repetition < 4 THEN 'learning'  
      WHEN v_sm2_result.new_ef > 2.8 AND v_sm2_result.new_interval > 30 THEN 'mastered'
      ELSE 'review'
    END,
    average_quality = (
      (average_quality * total_reviews + NEW.quality) / (total_reviews + 1)
    ),
    updated_at = NOW()
  WHERE flashcard_id = NEW.flashcard_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_card_schedule_after_review
  AFTER INSERT ON user_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_card_schedule_after_review();

-- Trigger to update user_stats daily
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_stats_record RECORD;
BEGIN
  -- Get or create today's stats record
  SELECT * INTO v_stats_record FROM user_stats WHERE date = v_today;
  
  IF v_stats_record IS NULL THEN
    INSERT INTO user_stats (date) VALUES (v_today);
    SELECT * INTO v_stats_record FROM user_stats WHERE date = v_today;
  END IF;
  
  -- Update stats based on the review
  UPDATE user_stats SET
    cards_reviewed = cards_reviewed + 1,
    cards_correct = cards_correct + CASE WHEN NEW.quality >= 3 THEN 1 ELSE 0 END,
    cards_incorrect = cards_incorrect + CASE WHEN NEW.quality < 3 THEN 1 ELSE 0 END,
    total_study_time_ms = total_study_time_ms + COALESCE(NEW.response_time_ms, 0),
    accuracy_rate = ROUND(
      (cards_correct + CASE WHEN NEW.quality >= 3 THEN 1 ELSE 0 END) * 100.0 / 
      (cards_reviewed + 1), 2
    ),
    updated_at = NOW()
  WHERE date = v_today;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for daily stats
CREATE TRIGGER trigger_update_daily_stats
  AFTER INSERT ON user_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_stats();

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Initialize achievement templates
INSERT INTO achievement_progress (achievement_type, achievement_name, achievement_description, target_progress, badge_icon, badge_color, points_awarded) VALUES
('daily_streak', 'Learning Streak - 7 Days', 'Study for 7 consecutive days', 7, '🔥', 'orange', 100),
('daily_streak', 'Learning Streak - 30 Days', 'Study for 30 consecutive days', 30, '🏆', 'gold', 500),
('cards_mastered', 'First 100 Words', 'Master your first 100 vocabulary words', 100, '📚', 'blue', 200),
('cards_mastered', 'Vocabulary Expert - 500 Words', 'Master 500 vocabulary words', 500, '🎓', 'purple', 1000),
('cards_mastered', 'IELTS Ready - 1000 Words', 'Master 1000 IELTS vocabulary words', 1000, '🌟', 'gold', 2000),
('perfect_session', 'Perfect Session - 10 Cards', 'Get 10 cards correct in a row', 10, '⚡', 'yellow', 50),
('perfect_session', 'Perfect Session - 50 Cards', 'Get 50 cards correct in a row', 50, '🎯', 'green', 250),
('speed_demon', 'Speed Demon - 1000 Fast Reviews', 'Complete 1000 reviews in under 3 seconds each', 1000, '🚀', 'red', 300);

-- =====================================================
-- VIEWS FOR EASY QUERYING
-- =====================================================

-- View for cards due for review today
CREATE OR REPLACE VIEW cards_due_today AS
SELECT 
  cs.*,
  f.english,
  f.vietnamese,
  f.ipa,
  f.difficulty,
  f.category,
  l.name as lesson_name,
  l.color as lesson_color
FROM card_schedule cs
JOIN flashcards f ON cs.flashcard_id = f.id
LEFT JOIN lessons l ON f.lesson_id = l.id
WHERE cs.next_review_date <= NOW()
  AND cs.card_state NOT IN ('suspended', 'mastered')
ORDER BY cs.next_review_date ASC;

-- View for learning progress summary
CREATE OR REPLACE VIEW learning_progress_summary AS
SELECT 
  COUNT(*) as total_cards,
  COUNT(CASE WHEN cs.card_state = 'new' THEN 1 END) as new_cards,
  COUNT(CASE WHEN cs.card_state = 'learning' THEN 1 END) as learning_cards,
  COUNT(CASE WHEN cs.card_state = 'review' THEN 1 END) as review_cards,
  COUNT(CASE WHEN cs.card_state = 'mastered' THEN 1 END) as mastered_cards,
  COUNT(CASE WHEN cs.next_review_date <= NOW() THEN 1 END) as cards_due_now,
  ROUND(AVG(cs.current_easiness_factor), 2) as average_easiness,
  ROUND(AVG(cs.current_interval_days), 0) as average_interval
FROM card_schedule cs
JOIN flashcards f ON cs.flashcard_id = f.id;

-- =====================================================
-- GRANT PERMISSIONS (if using RLS)
-- =====================================================

-- If using Row Level Security, add policies here
-- For now, we'll assume single-user or public access

COMMENT ON TABLE user_reviews IS 'Stores individual flashcard review sessions with SM-2 algorithm data';
COMMENT ON TABLE user_stats IS 'Daily learning statistics and progress tracking';
COMMENT ON TABLE card_schedule IS 'SM-2 scheduling information for each flashcard';
COMMENT ON TABLE study_sessions IS 'Complete study session tracking for analytics';
COMMENT ON TABLE achievement_progress IS 'User achievement and badge progress tracking';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
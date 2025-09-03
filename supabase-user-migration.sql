-- =====================================================
-- USER ID MIGRATION FOR SPACED REPETITION SYSTEM
-- Adds user_id columns to support multi-user functionality
-- =====================================================

-- 1. Add user_id column to card_schedule table
ALTER TABLE card_schedule 
ADD COLUMN user_id VARCHAR(255) NOT NULL DEFAULT 'vntopcoders@gmail.com';

-- Update unique constraint to include user_id
ALTER TABLE card_schedule 
DROP CONSTRAINT card_schedule_flashcard_id_key;

ALTER TABLE card_schedule 
ADD CONSTRAINT card_schedule_user_flashcard_unique 
UNIQUE(user_id, flashcard_id);

-- 2. Add user_id column to user_reviews table
ALTER TABLE user_reviews 
ADD COLUMN user_id VARCHAR(255) NOT NULL DEFAULT 'vntopcoders@gmail.com';

-- 3. Add user_id column to user_stats table
ALTER TABLE user_stats 
ADD COLUMN user_id VARCHAR(255) NOT NULL DEFAULT 'vntopcoders@gmail.com';

-- Update unique constraint for user_stats
ALTER TABLE user_stats 
DROP CONSTRAINT user_stats_date_key;

ALTER TABLE user_stats 
ADD CONSTRAINT user_stats_user_date_unique 
UNIQUE(user_id, date);

-- 4. Add user_id column to study_sessions table
ALTER TABLE study_sessions 
ADD COLUMN user_id VARCHAR(255) NOT NULL DEFAULT 'vntopcoders@gmail.com';

-- 5. Add user_id column to achievement_progress table
ALTER TABLE achievement_progress 
ADD COLUMN user_id VARCHAR(255) NOT NULL DEFAULT 'vntopcoders@gmail.com';

-- Update unique constraint for achievements
ALTER TABLE achievement_progress 
DROP CONSTRAINT achievement_progress_achievement_type_achievement_name_key;

ALTER TABLE achievement_progress 
ADD CONSTRAINT achievement_progress_user_type_name_unique 
UNIQUE(user_id, achievement_type, achievement_name);

-- =====================================================
-- UPDATE INDEXES FOR USER_ID QUERIES
-- =====================================================

-- Card Schedule indexes with user_id
CREATE INDEX idx_card_schedule_user_next_review ON card_schedule(user_id, next_review_date);
CREATE INDEX idx_card_schedule_user_state ON card_schedule(user_id, card_state);

-- User Reviews indexes with user_id
CREATE INDEX idx_user_reviews_user_flashcard ON user_reviews(user_id, flashcard_id);
CREATE INDEX idx_user_reviews_user_reviewed_at ON user_reviews(user_id, reviewed_at);

-- User Stats indexes with user_id
CREATE INDEX idx_user_stats_user_date ON user_stats(user_id, date);

-- Study Sessions indexes with user_id
CREATE INDEX idx_study_sessions_user_start ON study_sessions(user_id, session_start);

-- Achievement Progress indexes with user_id
CREATE INDEX idx_achievement_progress_user_type ON achievement_progress(user_id, achievement_type);

-- =====================================================
-- UPDATE FUNCTIONS TO SUPPORT USER_ID
-- =====================================================

-- Update the trigger function to handle user_id
CREATE OR REPLACE FUNCTION update_card_schedule_after_review()
RETURNS TRIGGER AS $$
DECLARE
  v_schedule_record RECORD;
  v_sm2_result RECORD;
BEGIN
  -- Get current schedule for the flashcard and user
  SELECT * INTO v_schedule_record 
  FROM card_schedule 
  WHERE flashcard_id = NEW.flashcard_id AND user_id = NEW.user_id;
  
  -- If no schedule exists, create one
  IF v_schedule_record IS NULL THEN
    INSERT INTO card_schedule (flashcard_id, user_id, first_studied_at) 
    VALUES (NEW.flashcard_id, NEW.user_id, NEW.reviewed_at);
    
    SELECT * INTO v_schedule_record 
    FROM card_schedule 
    WHERE flashcard_id = NEW.flashcard_id AND user_id = NEW.user_id;
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
  WHERE flashcard_id = NEW.flashcard_id AND user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update daily stats trigger to handle user_id
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_stats_record RECORD;
BEGIN
  -- Get or create today's stats record for this user
  SELECT * INTO v_stats_record 
  FROM user_stats 
  WHERE date = v_today AND user_id = NEW.user_id;
  
  IF v_stats_record IS NULL THEN
    INSERT INTO user_stats (date, user_id) VALUES (v_today, NEW.user_id);
    SELECT * INTO v_stats_record 
    FROM user_stats 
    WHERE date = v_today AND user_id = NEW.user_id;
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
  WHERE date = v_today AND user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE USER INITIALIZATION FUNCTIONS
-- =====================================================

-- Function to initialize card schedules for a new user
CREATE OR REPLACE FUNCTION initialize_user_card_schedule(target_user_id VARCHAR(255))
RETURNS INTEGER AS $$
DECLARE
  cards_initialized INTEGER := 0;
  flashcard_record RECORD;
BEGIN
  -- Insert card schedules for all flashcards for this user
  FOR flashcard_record IN 
    SELECT id FROM flashcards 
    WHERE NOT EXISTS (
      SELECT 1 FROM card_schedule 
      WHERE flashcard_id = flashcards.id AND user_id = target_user_id
    )
  LOOP
    INSERT INTO card_schedule (
      flashcard_id, 
      user_id,
      card_state,
      created_at,
      updated_at
    ) VALUES (
      flashcard_record.id,
      target_user_id,
      'new',
      NOW(),
      NOW()
    );
    cards_initialized := cards_initialized + 1;
  END LOOP;
  
  RETURN cards_initialized;
END;
$$ LANGUAGE plpgsql;

-- Function to initialize achievements for a new user
CREATE OR REPLACE FUNCTION initialize_user_achievements(target_user_id VARCHAR(255))
RETURNS INTEGER AS $$
DECLARE
  achievements_initialized INTEGER := 0;
BEGIN
  -- Initialize achievement templates for this user
  INSERT INTO achievement_progress (
    user_id, achievement_type, achievement_name, achievement_description, 
    target_progress, badge_icon, badge_color, points_awarded
  ) 
  SELECT 
    target_user_id, achievement_type, achievement_name, achievement_description,
    target_progress, badge_icon, badge_color, points_awarded
  FROM (VALUES
    ('daily_streak', 'Learning Streak - 7 Days', 'Study for 7 consecutive days', 7, '🔥', 'orange', 100),
    ('daily_streak', 'Learning Streak - 30 Days', 'Study for 30 consecutive days', 30, '🏆', 'gold', 500),
    ('cards_mastered', 'First 100 Words', 'Master your first 100 vocabulary words', 100, '📚', 'blue', 200),
    ('cards_mastered', 'Vocabulary Expert - 500 Words', 'Master 500 vocabulary words', 500, '🎓', 'purple', 1000),
    ('cards_mastered', 'IELTS Ready - 1000 Words', 'Master 1000 IELTS vocabulary words', 1000, '🌟', 'gold', 2000),
    ('perfect_session', 'Perfect Session - 10 Cards', 'Get 10 cards correct in a row', 10, '⚡', 'yellow', 50),
    ('perfect_session', 'Perfect Session - 50 Cards', 'Get 50 cards correct in a row', 50, '🎯', 'green', 250),
    ('speed_demon', 'Speed Demon - 1000 Fast Reviews', 'Complete 1000 reviews in under 3 seconds each', 1000, '🚀', 'red', 300)
  ) AS achievements(achievement_type, achievement_name, achievement_description, target_progress, badge_icon, badge_color, points_awarded)
  WHERE NOT EXISTS (
    SELECT 1 FROM achievement_progress 
    WHERE user_id = target_user_id 
    AND achievement_progress.achievement_type = achievements.achievement_type
    AND achievement_progress.achievement_name = achievements.achievement_name
  );
  
  GET DIAGNOSTICS achievements_initialized = ROW_COUNT;
  RETURN achievements_initialized;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- UPDATE VIEWS FOR USER-SPECIFIC QUERIES
-- =====================================================

-- Update the cards due today view to be user-specific
DROP VIEW IF EXISTS cards_due_today;
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
  AND cs.card_state NOT IN ('suspended', 'mastered');

-- Update learning progress summary view to be user-specific
DROP VIEW IF EXISTS learning_progress_summary;
CREATE OR REPLACE VIEW learning_progress_summary AS
SELECT 
  cs.user_id,
  COUNT(*) as total_cards,
  COUNT(CASE WHEN cs.card_state = 'new' THEN 1 END) as new_cards,
  COUNT(CASE WHEN cs.card_state = 'learning' THEN 1 END) as learning_cards,
  COUNT(CASE WHEN cs.card_state = 'review' THEN 1 END) as review_cards,
  COUNT(CASE WHEN cs.card_state = 'mastered' THEN 1 END) as mastered_cards,
  COUNT(CASE WHEN cs.next_review_date <= NOW() THEN 1 END) as cards_due_now,
  ROUND(AVG(cs.current_easiness_factor), 2) as average_easiness,
  ROUND(AVG(cs.current_interval_days), 0) as average_interval
FROM card_schedule cs
JOIN flashcards f ON cs.flashcard_id = f.id
GROUP BY cs.user_id;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON COLUMN card_schedule.user_id IS 'Identifies which user this card schedule belongs to';
COMMENT ON COLUMN user_reviews.user_id IS 'Identifies which user performed this review';
COMMENT ON COLUMN user_stats.user_id IS 'Identifies which user these stats belong to';
COMMENT ON COLUMN study_sessions.user_id IS 'Identifies which user this study session belongs to';
COMMENT ON COLUMN achievement_progress.user_id IS 'Identifies which user this achievement progress belongs to';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
-- Enhanced Vocabulary Learning System Migration
-- Run this in Supabase SQL Editor to add enhanced learning features

-- Add enhanced learning columns to flashcards table
ALTER TABLE flashcards 
ADD COLUMN IF NOT EXISTS examples TEXT,
ADD COLUMN IF NOT EXISTS collocations TEXT,
ADD COLUMN IF NOT EXISTS synonyms TEXT,
ADD COLUMN IF NOT EXISTS antonyms TEXT,
ADD COLUMN IF NOT EXISTS etymology TEXT,
ADD COLUMN IF NOT EXISTS memory_tips TEXT;

-- Add spaced repetition columns
ALTER TABLE flashcards 
ADD COLUMN IF NOT EXISTS ease_factor DECIMAL DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS interval INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS repetitions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS times_studied INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS times_correct INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS times_wrong INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mastery_level TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS next_review TIMESTAMP;

-- Add comments for documentation
COMMENT ON COLUMN flashcards.examples IS 'JSON array of example sentences with translations and context';
COMMENT ON COLUMN flashcards.collocations IS 'JSON array of common word combinations and phrases';
COMMENT ON COLUMN flashcards.synonyms IS 'JSON array of synonymous words';
COMMENT ON COLUMN flashcards.antonyms IS 'JSON array of antonymous words';
COMMENT ON COLUMN flashcards.etymology IS 'Word origin and historical development';
COMMENT ON COLUMN flashcards.memory_tips IS 'Memory techniques and mnemonics for learning';
COMMENT ON COLUMN flashcards.ease_factor IS 'SM-2 algorithm ease factor (1.3-4.0)';
COMMENT ON COLUMN flashcards.interval IS 'Days until next review';
COMMENT ON COLUMN flashcards.repetitions IS 'Number of successful repetitions';
COMMENT ON COLUMN flashcards.times_studied IS 'Total number of study sessions';
COMMENT ON COLUMN flashcards.times_correct IS 'Number of correct responses';
COMMENT ON COLUMN flashcards.times_wrong IS 'Number of incorrect responses';
COMMENT ON COLUMN flashcards.mastery_level IS 'Learning progress: new, learning, familiar, mastered';
COMMENT ON COLUMN flashcards.next_review IS 'Next scheduled review date/time';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards(next_review);
CREATE INDEX IF NOT EXISTS idx_flashcards_mastery_level ON flashcards(mastery_level);
CREATE INDEX IF NOT EXISTS idx_flashcards_ease_factor ON flashcards(ease_factor);

-- Update existing flashcards with default spaced repetition values
UPDATE flashcards 
SET 
  ease_factor = 2.5,
  interval = 1,
  repetitions = 0,
  times_studied = 0,
  times_correct = 0,
  times_wrong = 0,
  mastery_level = 'new'
WHERE ease_factor IS NULL;

-- Create or update spaced repetition tables if they don't exist
CREATE TABLE IF NOT EXISTS card_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  next_review_date TIMESTAMP NOT NULL DEFAULT NOW(),
  current_interval_days INTEGER DEFAULT 1,
  current_easiness_factor DECIMAL DEFAULT 2.5,
  current_repetition_number INTEGER DEFAULT 0,
  card_state TEXT DEFAULT 'new' CHECK (card_state IN ('new', 'learning', 'review', 'relearning', 'suspended', 'mastered')),
  consecutive_correct INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_lapses INTEGER DEFAULT 0,
  average_quality DECIMAL DEFAULT 0.0,
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  response_time_ms INTEGER,
  reviewed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_start TIMESTAMP DEFAULT NOW(),
  session_end TIMESTAMP,
  total_duration_ms INTEGER,
  cards_studied INTEGER DEFAULT 0,
  new_cards INTEGER DEFAULT 0,
  review_cards INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  session_type TEXT CHECK (session_type IN ('new_cards', 'reviews', 'mixed', 'cram', 'test')),
  lesson_focus TEXT,
  accuracy_rate DECIMAL,
  average_response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  cards_reviewed INTEGER DEFAULT 0,
  cards_learned INTEGER DEFAULT 0,
  cards_relearned INTEGER DEFAULT 0,
  cards_correct INTEGER DEFAULT 0,
  cards_incorrect INTEGER DEFAULT 0,
  total_study_time_ms INTEGER DEFAULT 0,
  accuracy_rate DECIMAL DEFAULT 0.0,
  daily_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date)
);

CREATE TABLE IF NOT EXISTS achievement_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_type TEXT NOT NULL,
  current_progress INTEGER DEFAULT 0,
  target_progress INTEGER DEFAULT 100,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(achievement_type)
);

-- Create indexes for spaced repetition tables
CREATE INDEX IF NOT EXISTS idx_card_schedule_flashcard_id ON card_schedule(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_card_schedule_next_review ON card_schedule(next_review_date);
CREATE INDEX IF NOT EXISTS idx_card_schedule_state ON card_schedule(card_state);
CREATE INDEX IF NOT EXISTS idx_user_reviews_flashcard_id ON user_reviews(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewed_at ON user_reviews(reviewed_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_start ON study_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_user_stats_date ON user_stats(date);

-- Insert sample achievement types (if table exists)
-- Note: Skip if achievement_progress table doesn't exist yet
-- INSERT INTO achievement_progress (achievement_type, target_progress) VALUES
--   ('daily_streak', 7),
--   ('vocabulary_master', 100),
--   ('perfect_week', 7),
--   ('speed_learner', 50),
--   ('consistency_champion', 30);

-- Success message
SELECT 'Enhanced vocabulary learning system migration completed successfully!' as result;
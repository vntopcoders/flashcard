-- Reset and Clean Progress Tables
-- This will drop everything and start fresh

-- Step 1: Drop all existing objects that might cause conflicts
DROP VIEW IF EXISTS user_current_status CASCADE;
DROP VIEW IF EXISTS user_weekly_summary CASCADE;
DROP VIEW IF EXISTS user_phase_overview CASCADE;
DROP FUNCTION IF EXISTS complete_daily_lesson(VARCHAR(255), INTEGER, INTEGER, INTEGER, DECIMAL(5,2)) CASCADE;
DROP FUNCTION IF EXISTS initialize_user_progress(VARCHAR(255)) CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS phase_progress CASCADE;
DROP TABLE IF EXISTS weekly_progress CASCADE;
DROP TABLE IF EXISTS daily_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;

-- Step 2: Create user_progress table (very basic)
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  current_week INTEGER DEFAULT 1,
  current_day INTEGER DEFAULT 1,
  total_days_studied INTEGER DEFAULT 0,
  total_words_learned INTEGER DEFAULT 0,
  current_phase VARCHAR(50) DEFAULT 'Foundation',
  study_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date TIMESTAMP,
  target_score DECIMAL(2,1) DEFAULT 8.0,
  current_estimated_score DECIMAL(2,1) DEFAULT 5.5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 3: Create daily lesson progress table
CREATE TABLE daily_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  day_number INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  words_learned INTEGER DEFAULT 0,
  words_target INTEGER DEFAULT 20,
  grammar_completed BOOLEAN DEFAULT FALSE,
  skills_practiced TEXT[],
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP,
  study_time_minutes INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Step 4: Create basic indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_daily_progress_user_id ON daily_lesson_progress(user_id);
CREATE INDEX idx_daily_progress_day ON daily_lesson_progress(day_number);
CREATE INDEX idx_daily_progress_user_day ON daily_lesson_progress(user_id, day_number);

-- Step 5: Very simple initialization function
CREATE OR REPLACE FUNCTION initialize_user_progress(p_user_id VARCHAR(255))
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_progress (user_id) 
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Test the basic setup
SELECT initialize_user_progress('demo-user');

-- Verify tables exist and work
INSERT INTO daily_lesson_progress (user_id, day_number, week_number, words_learned, is_completed)
VALUES ('demo-user', 1, 1, 20, true)
ON CONFLICT (user_id, day_number) DO UPDATE SET
  words_learned = 20,
  is_completed = true,
  updated_at = NOW();

-- Check if everything works
SELECT 'Tables created successfully' AS status;
SELECT COUNT(*) AS user_progress_count FROM user_progress;
SELECT COUNT(*) AS daily_progress_count FROM daily_lesson_progress;
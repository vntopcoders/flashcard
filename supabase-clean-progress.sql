-- Clean User Progress Setup - Step by Step
-- Run this file to create the basic user progress tables

-- Step 1: Create user_progress table (basic structure)
CREATE TABLE IF NOT EXISTS user_progress (
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

-- Step 2: Create daily lesson progress table
CREATE TABLE IF NOT EXISTS daily_lesson_progress (
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

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_id ON daily_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_day ON daily_lesson_progress(day_number);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_day ON daily_lesson_progress(user_id, day_number);

-- Step 4: Simple function to initialize user
CREATE OR REPLACE FUNCTION initialize_user_progress(p_user_id VARCHAR(255))
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_progress (user_id) 
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Function to complete daily lesson
CREATE OR REPLACE FUNCTION complete_daily_lesson(
  p_user_id VARCHAR(255),
  p_day_number INTEGER,
  p_words_learned INTEGER DEFAULT 20,
  p_study_time_minutes INTEGER DEFAULT 30,
  p_accuracy DECIMAL(5,2) DEFAULT 85.0
)
RETURNS JSON AS $$
DECLARE
  v_week_number INTEGER;
  v_phase VARCHAR(50);
  v_result JSON;
BEGIN
  v_week_number := CEIL(p_day_number::DECIMAL / 7);
  
  -- Determine phase
  IF v_week_number <= 12 THEN v_phase := 'Foundation';
  ELSIF v_week_number <= 24 THEN v_phase := 'Development';
  ELSIF v_week_number <= 32 THEN v_phase := 'Mastery';
  ELSE v_phase := 'Expert';
  END IF;
  
  -- Update daily lesson progress
  INSERT INTO daily_lesson_progress (
    user_id, day_number, week_number, words_learned, is_completed, 
    completion_date, study_time_minutes, accuracy_percentage
  )
  VALUES (
    p_user_id, p_day_number, v_week_number, p_words_learned, TRUE,
    NOW(), p_study_time_minutes, p_accuracy
  )
  ON CONFLICT (user_id, day_number) 
  DO UPDATE SET
    words_learned = p_words_learned,
    is_completed = TRUE,
    completion_date = NOW(),
    study_time_minutes = p_study_time_minutes,
    accuracy_percentage = p_accuracy,
    updated_at = NOW();
  
  -- Update user overall progress
  UPDATE user_progress SET
    current_day = GREATEST(current_day, p_day_number + 1),
    current_week = CEIL((GREATEST(current_day, p_day_number + 1))::DECIMAL / 7),
    current_phase = CASE 
      WHEN CEIL((GREATEST(current_day, p_day_number + 1))::DECIMAL / 7) <= 12 THEN 'Foundation'
      WHEN CEIL((GREATEST(current_day, p_day_number + 1))::DECIMAL / 7) <= 24 THEN 'Development'
      WHEN CEIL((GREATEST(current_day, p_day_number + 1))::DECIMAL / 7) <= 32 THEN 'Mastery'
      ELSE 'Expert'
    END,
    total_days_studied = total_days_studied + 1,
    total_words_learned = total_words_learned + p_words_learned,
    last_study_date = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Return success result
  SELECT json_build_object(
    'success', true,
    'day_completed', p_day_number,
    'words_learned', p_words_learned,
    'next_day', p_day_number + 1,
    'current_phase', v_phase
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Test data
SELECT initialize_user_progress('demo-user');

-- Simple test queries:
-- SELECT * FROM user_progress WHERE user_id = 'demo-user';
-- SELECT complete_daily_lesson('demo-user', 1, 20, 25, 88.5);
-- SELECT * FROM daily_lesson_progress WHERE user_id = 'demo-user';
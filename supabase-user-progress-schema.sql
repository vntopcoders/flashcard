-- User Progress Schema for 36-Week IELTS Daily System
-- Tracks individual user progress through the 252-day learning journey

-- Create user_progress table for tracking overall progress
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  current_week INTEGER DEFAULT 1 CHECK (current_week >= 1 AND current_week <= 36),
  current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 252),
  total_days_studied INTEGER DEFAULT 0,
  total_words_learned INTEGER DEFAULT 0,
  current_phase VARCHAR(50) DEFAULT 'Foundation' CHECK (current_phase IN ('Foundation', 'Development', 'Mastery', 'Expert')),
  study_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date TIMESTAMP,
  target_score DECIMAL(2,1) DEFAULT 8.0,
  current_estimated_score DECIMAL(2,1) DEFAULT 5.5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create comprehensive daily lesson progress tracking
CREATE TABLE IF NOT EXISTS daily_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  daily_lesson_id UUID, -- Will reference daily_lessons table
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 252),
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 36),
  words_learned INTEGER DEFAULT 0,
  words_target INTEGER DEFAULT 20,
  grammar_completed BOOLEAN DEFAULT FALSE,
  skills_practiced TEXT[], -- Array of skills practiced
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP,
  study_time_minutes INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Create weekly progress summary table
CREATE TABLE IF NOT EXISTS weekly_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 36),
  phase VARCHAR(50) NOT NULL,
  days_completed INTEGER DEFAULT 0,
  total_words_learned INTEGER DEFAULT 0,
  total_study_time_minutes INTEGER DEFAULT 0,
  average_accuracy DECIMAL(5,2) DEFAULT 0.0,
  grammar_topics_completed INTEGER DEFAULT 0,
  is_week_completed BOOLEAN DEFAULT FALSE,
  week_start_date TIMESTAMP,
  week_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

-- Create phase progress tracking
CREATE TABLE IF NOT EXISTS phase_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  phase VARCHAR(50) NOT NULL CHECK (phase IN ('Foundation', 'Development', 'Mastery', 'Expert')),
  start_week INTEGER NOT NULL,
  end_week INTEGER NOT NULL,
  days_completed INTEGER DEFAULT 0,
  total_days INTEGER NOT NULL,
  words_learned INTEGER DEFAULT 0,
  words_target INTEGER NOT NULL,
  estimated_score_start DECIMAL(2,1),
  estimated_score_end DECIMAL(2,1),
  is_phase_completed BOOLEAN DEFAULT FALSE,
  phase_start_date TIMESTAMP,
  phase_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, phase)
);

-- Create achievement tracking table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  achievement_type VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  icon VARCHAR(10),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  day_unlocked INTEGER,
  week_unlocked INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_current_day ON user_progress(current_day);
CREATE INDEX IF NOT EXISTS idx_user_progress_phase ON user_progress(current_phase);

CREATE INDEX IF NOT EXISTS idx_daily_progress_user_id ON daily_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_day ON daily_lesson_progress(day_number);
CREATE INDEX IF NOT EXISTS idx_daily_progress_week ON daily_lesson_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_day ON daily_lesson_progress(user_id, day_number);

CREATE INDEX IF NOT EXISTS idx_weekly_progress_user_id ON weekly_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_week ON weekly_progress(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_user_week ON weekly_progress(user_id, week_number);

CREATE INDEX IF NOT EXISTS idx_phase_progress_user_id ON phase_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_phase_progress_phase ON phase_progress(phase);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON user_achievements(achievement_type);

-- Create useful views for progress tracking
-- View: Current user status
CREATE OR REPLACE VIEW user_current_status AS
SELECT 
  up.user_id,
  up.current_week,
  up.current_day,
  up.current_phase,
  up.total_days_studied,
  up.total_words_learned,
  up.study_streak,
  up.target_score,
  up.current_estimated_score,
  up.last_study_date,
  CASE 
    WHEN up.current_phase = 'Foundation' THEN ROUND((up.current_day::DECIMAL / 84) * 100, 1)
    WHEN up.current_phase = 'Development' THEN ROUND(((up.current_day - 84)::DECIMAL / 84) * 100, 1)
    WHEN up.current_phase = 'Mastery' THEN ROUND(((up.current_day - 168)::DECIMAL / 56) * 100, 1)
    WHEN up.current_phase = 'Expert' THEN ROUND(((up.current_day - 224)::DECIMAL / 28) * 100, 1)
    ELSE 0
  END as phase_progress_percentage,
  ROUND((up.current_day::DECIMAL / 252) * 100, 1) as overall_progress_percentage,
  dl.title as current_lesson_title,
  dl.description as current_lesson_description,
  dl.grammar_focus as current_grammar_focus
FROM user_progress up
LEFT JOIN daily_lessons dl ON dl.day_number = up.current_day;

-- View: Weekly progress summary
CREATE OR REPLACE VIEW user_weekly_summary AS
SELECT 
  wp.user_id,
  wp.week_number,
  wp.phase,
  wp.days_completed,
  wp.total_words_learned,
  wp.total_study_time_minutes,
  wp.average_accuracy,
  wp.is_week_completed,
  ROUND((wp.days_completed::DECIMAL / 7) * 100, 1) as week_completion_percentage
FROM weekly_progress wp
ORDER BY wp.week_number;

-- View: Phase progress overview
CREATE OR REPLACE VIEW user_phase_overview AS
SELECT 
  pp.user_id,
  pp.phase,
  pp.days_completed,
  pp.total_days,
  pp.words_learned,
  pp.words_target,
  pp.is_phase_completed,
  ROUND((pp.days_completed::DECIMAL / pp.total_days) * 100, 1) as phase_completion_percentage,
  ROUND((pp.words_learned::DECIMAL / pp.words_target) * 100, 1) as vocabulary_progress_percentage,
  pp.estimated_score_start,
  pp.estimated_score_end,
  CASE 
    WHEN pp.is_phase_completed THEN 'Completed'
    WHEN pp.days_completed > 0 THEN 'In Progress'
    ELSE 'Not Started'
  END as phase_status
FROM phase_progress pp
ORDER BY 
  CASE pp.phase
    WHEN 'Foundation' THEN 1
    WHEN 'Development' THEN 2
    WHEN 'Mastery' THEN 3
    WHEN 'Expert' THEN 4
  END;

-- Insert default phase configurations
INSERT INTO phase_progress (user_id, phase, start_week, end_week, total_days, words_target, estimated_score_start, estimated_score_end) 
VALUES 
  ('default', 'Foundation', 1, 12, 84, 1680, 4.0, 5.5),
  ('default', 'Development', 13, 24, 84, 1680, 5.5, 6.5),
  ('default', 'Mastery', 25, 32, 56, 1120, 6.5, 7.5),
  ('default', 'Expert', 33, 36, 28, 560, 7.5, 8.5)
ON CONFLICT (user_id, phase) DO NOTHING;

-- Function to initialize user progress
CREATE OR REPLACE FUNCTION initialize_user_progress(p_user_id VARCHAR(255))
RETURNS VOID AS $$
BEGIN
  -- Insert user progress if not exists
  INSERT INTO user_progress (user_id) 
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Initialize phase progress for this user
  INSERT INTO phase_progress (user_id, phase, start_week, end_week, total_days, words_target, estimated_score_start, estimated_score_end)
  SELECT 
    p_user_id,
    phase,
    start_week,
    end_week,
    total_days,
    words_target,
    estimated_score_start,
    estimated_score_end
  FROM phase_progress 
  WHERE user_id = 'default'
  ON CONFLICT (user_id, phase) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to update user progress when completing a day
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

-- Sample queries for testing
-- Get user current status: SELECT * FROM user_current_status WHERE user_id = 'test-user';
-- Initialize user: SELECT initialize_user_progress('test-user');
-- Complete a day: SELECT complete_daily_lesson('test-user', 1, 20, 25, 88.5);
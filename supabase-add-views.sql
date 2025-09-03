-- Add Views After Tables Are Created
-- Run this ONLY after supabase-clean-progress.sql has run successfully

-- Simple user status view
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
  -- Simple progress calculation
  ROUND((up.current_day::DECIMAL / 252) * 100, 1) as overall_progress_percentage,
  -- Phase-specific progress
  CASE 
    WHEN up.current_phase = 'Foundation' THEN 
      ROUND((up.current_day::DECIMAL / 84) * 100, 1)
    WHEN up.current_phase = 'Development' THEN 
      ROUND(((up.current_day - 84)::DECIMAL / 84) * 100, 1)
    WHEN up.current_phase = 'Mastery' THEN 
      ROUND(((up.current_day - 168)::DECIMAL / 56) * 100, 1)
    WHEN up.current_phase = 'Expert' THEN 
      ROUND(((up.current_day - 224)::DECIMAL / 28) * 100, 1)
    ELSE 0
  END as phase_progress_percentage
FROM user_progress up;

-- Test the view
SELECT * FROM user_current_status WHERE user_id = 'demo-user';
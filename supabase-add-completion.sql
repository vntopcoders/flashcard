-- Add completion function after tables are working
-- Run this ONLY after supabase-reset-progress.sql succeeds

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

-- Test the completion function
SELECT complete_daily_lesson('demo-user', 1, 20, 25, 88.5);
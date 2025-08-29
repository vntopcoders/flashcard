import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth/next'

// Admin endpoint for creating study plan database schema
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Creating study plan database schema...')

    const schemaSQL = `
-- =====================================================
-- STUDY PLAN DATABASE SCHEMA
-- User-specific daily lessons and study plans
-- =====================================================

-- Study Plan Templates (24-week IELTS plan structure)
CREATE TABLE IF NOT EXISTS study_plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  total_weeks INTEGER NOT NULL DEFAULT 24,
  target_level TEXT NOT NULL DEFAULT 'intermediate',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Plan Templates
CREATE TABLE IF NOT EXISTS weekly_plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_plan_template_id UUID NOT NULL REFERENCES study_plan_templates(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  target_band TEXT,
  vocabulary_goal INTEGER DEFAULT 0,
  grammar_units TEXT,
  focus_skills JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  daily_hours DECIMAL(3,1) DEFAULT 2.5,
  phase TEXT, -- 'foundation', 'development', 'mastery', 'final'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(study_plan_template_id, week_number)
);

-- Daily Task Templates
CREATE TABLE IF NOT EXISTS daily_task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_plan_template_id UUID NOT NULL REFERENCES weekly_plan_templates(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  time_slot TEXT, -- '7:00-7:30'
  duration_minutes INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill TEXT NOT NULL CHECK (skill IN ('vocabulary', 'grammar', 'reading', 'writing', 'listening', 'speaking')),
  resources JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Study Plans (instances for specific users)
CREATE TABLE IF NOT EXISTS user_study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  study_plan_template_id UUID NOT NULL REFERENCES study_plan_templates(id),
  start_date DATE NOT NULL,
  target_completion_date DATE,
  current_week INTEGER DEFAULT 1,
  current_day INTEGER DEFAULT 1,
  target_score DECIMAL(2,1) DEFAULT 7.0,
  current_score DECIMAL(2,1),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, study_plan_template_id)
);

-- User Weekly Progress
CREATE TABLE IF NOT EXISTS user_weekly_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_study_plan_id UUID NOT NULL REFERENCES user_study_plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  vocabulary_learned INTEGER DEFAULT 0,
  vocabulary_goal INTEGER DEFAULT 0,
  grammar_completed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  total_study_minutes INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_study_plan_id, week_number)
);

-- User Daily Tasks (actual task instances for users)
CREATE TABLE IF NOT EXISTS user_daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_study_plan_id UUID NOT NULL REFERENCES user_study_plans(id) ON DELETE CASCADE,
  daily_task_template_id UUID REFERENCES daily_task_templates(id),
  scheduled_date DATE NOT NULL,
  week_number INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL,
  time_slot TEXT,
  duration_minutes INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill TEXT NOT NULL,
  resources JSONB DEFAULT '[]',
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  actual_duration_minutes INTEGER,
  notes TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grammar Lessons
CREATE TABLE IF NOT EXISTS grammar_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT DEFAULT 'intermediate', -- beginner, intermediate, advanced
  grammar_points JSONB DEFAULT '[]',
  examples JSONB DEFAULT '[]',
  exercises JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(unit_number)
);

-- User Grammar Progress
CREATE TABLE IF NOT EXISTS user_grammar_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  grammar_lesson_id UUID NOT NULL REFERENCES grammar_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  total_exercises INTEGER DEFAULT 0,
  score INTEGER, -- percentage score
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, grammar_lesson_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_plan_templates_study_plan ON weekly_plan_templates(study_plan_template_id);
CREATE INDEX IF NOT EXISTS idx_daily_task_templates_weekly_plan ON daily_task_templates(weekly_plan_template_id);
CREATE INDEX IF NOT EXISTS idx_user_study_plans_user_id ON user_study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_plans_active ON user_study_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_weekly_progress_plan ON user_weekly_progress(user_study_plan_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_tasks_plan_date ON user_daily_tasks(user_study_plan_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_daily_tasks_date ON user_daily_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_user ON user_grammar_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_grammar_lessons_level ON grammar_lessons(level);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all relevant tables
DO $$ 
BEGIN
    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS update_study_plan_templates_updated_at ON study_plan_templates;
    DROP TRIGGER IF EXISTS update_weekly_plan_templates_updated_at ON weekly_plan_templates;
    DROP TRIGGER IF EXISTS update_daily_task_templates_updated_at ON daily_task_templates;
    DROP TRIGGER IF EXISTS update_user_study_plans_updated_at ON user_study_plans;
    DROP TRIGGER IF EXISTS update_user_weekly_progress_updated_at ON user_weekly_progress;
    DROP TRIGGER IF EXISTS update_user_daily_tasks_updated_at ON user_daily_tasks;
    DROP TRIGGER IF EXISTS update_grammar_lessons_updated_at ON grammar_lessons;
    DROP TRIGGER IF EXISTS update_user_grammar_progress_updated_at ON user_grammar_progress;
    
    -- Create new triggers
    CREATE TRIGGER update_study_plan_templates_updated_at
        BEFORE UPDATE ON study_plan_templates
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_weekly_plan_templates_updated_at
        BEFORE UPDATE ON weekly_plan_templates
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_daily_task_templates_updated_at
        BEFORE UPDATE ON daily_task_templates
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_user_study_plans_updated_at
        BEFORE UPDATE ON user_study_plans
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_user_weekly_progress_updated_at
        BEFORE UPDATE ON user_weekly_progress
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_user_daily_tasks_updated_at
        BEFORE UPDATE ON user_daily_tasks
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_grammar_lessons_updated_at
        BEFORE UPDATE ON grammar_lessons
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_user_grammar_progress_updated_at
        BEFORE UPDATE ON user_grammar_progress
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Success message
SELECT 'Study plan database schema created successfully!' as result;
    `

    // Execute the schema creation
    const { data, error } = await supabase.rpc('exec', { sql: schemaSQL })

    if (error) {
      console.error('Schema creation error:', error)
      return NextResponse.json(
        { error: 'Schema creation failed', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Study plan database schema created successfully',
      data
    })

  } catch (error) {
    console.error('Schema creation error:', error)
    return NextResponse.json(
      { error: 'Schema creation failed', details: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Study plan schema endpoint ready. Use POST to create schema.',
    warning: 'This endpoint creates database schema for user-specific study plans.'
  })
}
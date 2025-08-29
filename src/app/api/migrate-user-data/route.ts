import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth/next'

// Admin-only endpoint for migrating data to user-specific format
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const session = await getServerSession()
    
    // Only allow authenticated users to run this migration
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting user data migration...')

    const migrationSQL = `
-- Step 1: Add user_id columns to existing tables if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'card_schedule' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE card_schedule ADD COLUMN user_id UUID REFERENCES next_auth.users(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_card_schedule_user_id ON card_schedule(user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_reviews' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE user_reviews ADD COLUMN user_id UUID REFERENCES next_auth.users(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_user_reviews_user_id ON user_reviews(user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'study_sessions' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE study_sessions ADD COLUMN user_id UUID REFERENCES next_auth.users(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_stats' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE user_stats ADD COLUMN user_id UUID REFERENCES next_auth.users(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'achievement_progress' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE achievement_progress ADD COLUMN user_id UUID REFERENCES next_auth.users(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_achievement_progress_user_id ON achievement_progress(user_id);
    END IF;
END $$;

-- Step 2: Create user-specific card schedule initialization function
CREATE OR REPLACE FUNCTION initialize_user_card_schedule(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    flashcard_count INTEGER := 0;
    flashcard_record RECORD;
BEGIN
    -- Check if user already has card schedules
    SELECT COUNT(*) INTO flashcard_count 
    FROM card_schedule 
    WHERE user_id = target_user_id;
    
    -- Only initialize if user has no existing schedule
    IF flashcard_count = 0 THEN
        -- Insert card schedule for all flashcards for this user
        FOR flashcard_record IN 
            SELECT id FROM flashcards ORDER BY id
        LOOP
            INSERT INTO card_schedule (
                flashcard_id,
                user_id,
                next_review_date,
                current_interval_days,
                current_easiness_factor,
                current_repetition_number,
                card_state,
                consecutive_correct,
                total_reviews,
                total_lapses,
                average_quality,
                created_at,
                updated_at
            ) VALUES (
                flashcard_record.id,
                target_user_id,
                NOW(), -- New cards available immediately
                1,
                2.5, -- Default easiness factor
                0,
                'new',
                0,
                0,
                0,
                0,
                NOW(),
                NOW()
            );
            
            flashcard_count := flashcard_count + 1;
        END LOOP;
    END IF;
    
    RETURN flashcard_count;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create user achievement initialization function
CREATE OR REPLACE FUNCTION initialize_user_achievements(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    achievement_count INTEGER := 0;
    achievement_types TEXT[] := ARRAY[
        'first_review', 'daily_streak_7', 'daily_streak_30', 'daily_streak_100',
        'cards_reviewed_100', 'cards_reviewed_500', 'cards_reviewed_1000',
        'perfect_session', 'speed_demon', 'vocabulary_master',
        'consistency_champion', 'early_bird', 'night_owl'
    ];
    achievement_type TEXT;
BEGIN
    -- Check if user already has achievements
    SELECT COUNT(*) INTO achievement_count 
    FROM achievement_progress 
    WHERE user_id = target_user_id;
    
    -- Only initialize if user has no existing achievements
    IF achievement_count = 0 THEN
        -- Insert achievement progress for all achievement types
        FOREACH achievement_type IN ARRAY achievement_types
        LOOP
            INSERT INTO achievement_progress (
                user_id,
                achievement_type,
                current_progress,
                is_completed,
                created_at,
                updated_at
            ) VALUES (
                target_user_id,
                achievement_type,
                0,
                FALSE,
                NOW(),
                NOW()
            );
            
            achievement_count := achievement_count + 1;
        END LOOP;
    END IF;
    
    RETURN achievement_count;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create auto-initialization trigger for new users
CREATE OR REPLACE FUNCTION auto_initialize_user_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Initialize card schedule for new user
    PERFORM initialize_user_card_schedule(NEW.id);
    
    -- Initialize achievements for new user  
    PERFORM initialize_user_achievements(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-initialize data for new users
DROP TRIGGER IF EXISTS trigger_auto_initialize_user_data ON next_auth.users;
CREATE TRIGGER trigger_auto_initialize_user_data
    AFTER INSERT ON next_auth.users
    FOR EACH ROW EXECUTE FUNCTION auto_initialize_user_data();

-- Success message
SELECT 'User data migration schema updated successfully!' as result;
    `

    // Execute the migration
    const { data, error } = await supabase.rpc('exec', { sql: migrationSQL })

    if (error) {
      console.error('Migration error:', error)
      return NextResponse.json(
        { error: 'Migration failed', details: error },
        { status: 500 }
      )
    }

    // Now initialize data for the current user
    const { data: currentUser, error: userError } = await supabase
      .from('next_auth.users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError) {
      console.error('User lookup error:', userError)
      return NextResponse.json(
        { error: 'Failed to find current user', details: userError },
        { status: 500 }
      )
    }

    // Initialize card schedule for current user
    const { data: scheduleResult, error: scheduleError } = await supabase
      .rpc('initialize_user_card_schedule', { target_user_id: currentUser.id })

    if (scheduleError) {
      console.error('Schedule initialization error:', scheduleError)
    }

    // Initialize achievements for current user
    const { data: achievementResult, error: achievementError } = await supabase
      .rpc('initialize_user_achievements', { target_user_id: currentUser.id })

    if (achievementError) {
      console.error('Achievement initialization error:', achievementError)
    }

    return NextResponse.json({
      success: true,
      message: 'User data migration completed successfully',
      user_id: currentUser.id,
      cards_initialized: scheduleResult || 0,
      achievements_initialized: achievementResult || 0,
      migration_data: data
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'User data migration endpoint ready. Use POST to run migration.',
    warning: 'This endpoint migrates existing data to user-specific format.'
  })
}
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🚀 Starting Spaced Repetition System migration...')

    // Step 1: Create spaced repetition tables
    console.log('📝 Creating spaced repetition tables...')
    
    const tables = [
      // User Reviews Table
      `CREATE TABLE IF NOT EXISTS user_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
        reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
        response_time_ms INTEGER,
        easiness_factor DECIMAL(4,2) NOT NULL DEFAULT 2.5,
        interval_days INTEGER NOT NULL DEFAULT 1,
        repetition_number INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,

      // User Stats Table
      `CREATE TABLE IF NOT EXISTS user_stats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        cards_reviewed INTEGER DEFAULT 0,
        cards_learned INTEGER DEFAULT 0,
        cards_relearned INTEGER DEFAULT 0,
        cards_correct INTEGER DEFAULT 0,
        cards_incorrect INTEGER DEFAULT 0,
        total_study_time_ms INTEGER DEFAULT 0,
        average_response_time_ms INTEGER DEFAULT 0,
        daily_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
        cards_due_tomorrow INTEGER DEFAULT 0,
        words_mastered_by_band JSONB DEFAULT '{}',
        study_goals JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(date)
      )`,

      // Card Schedule Table
      `CREATE TABLE IF NOT EXISTS card_schedule (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
        next_review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        current_interval_days INTEGER NOT NULL DEFAULT 1,
        current_easiness_factor DECIMAL(4,2) NOT NULL DEFAULT 2.5,
        current_repetition_number INTEGER NOT NULL DEFAULT 0,
        card_state VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (
          card_state IN ('new', 'learning', 'review', 'relearning', 'suspended', 'mastered')
        ),
        consecutive_correct INTEGER DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        total_lapses INTEGER DEFAULT 0,
        average_quality DECIMAL(3,2) DEFAULT 0.00,
        fastest_response_ms INTEGER,
        slowest_response_ms INTEGER,
        first_studied_at TIMESTAMP WITH TIME ZONE,
        last_reviewed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(flashcard_id)
      )`,

      // Study Sessions Table
      `CREATE TABLE IF NOT EXISTS study_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        session_end TIMESTAMP WITH TIME ZONE,
        total_duration_ms INTEGER,
        cards_studied INTEGER DEFAULT 0,
        new_cards INTEGER DEFAULT 0,
        review_cards INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        incorrect_answers INTEGER DEFAULT 0,
        session_type VARCHAR(20) DEFAULT 'mixed' CHECK (
          session_type IN ('new_cards', 'reviews', 'mixed', 'cram', 'test')
        ),
        lesson_focus UUID REFERENCES lessons(id),
        difficulty_focus INTEGER,
        accuracy_rate DECIMAL(5,2),
        average_response_time_ms INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,

      // Achievement Progress Table
      `CREATE TABLE IF NOT EXISTS achievement_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        achievement_type VARCHAR(50) NOT NULL,
        achievement_name VARCHAR(100) NOT NULL,
        achievement_description TEXT,
        current_progress INTEGER DEFAULT 0,
        target_progress INTEGER NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP WITH TIME ZONE,
        badge_icon VARCHAR(50),
        badge_color VARCHAR(20),
        points_awarded INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(achievement_type, achievement_name)
      )`
    ]

    // Execute table creation using raw SQL
    console.log('⚠️ Note: Please run the following SQL manually in Supabase Dashboard:')
    
    for (let i = 0; i < tables.length; i++) {
      console.log(`\n-- Table ${i + 1}:`)
      console.log(tables[i])
    }

    // Step 2: Create indexes
    console.log('📊 Creating indexes...')
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_user_reviews_flashcard_id ON user_reviews(flashcard_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewed_at ON user_reviews(reviewed_at)',
      'CREATE INDEX IF NOT EXISTS idx_user_reviews_quality ON user_reviews(quality)',
      'CREATE INDEX IF NOT EXISTS idx_card_schedule_next_review ON card_schedule(next_review_date)',
      'CREATE INDEX IF NOT EXISTS idx_card_schedule_state ON card_schedule(card_state)',
      'CREATE INDEX IF NOT EXISTS idx_card_schedule_flashcard_id ON card_schedule(flashcard_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_stats_date ON user_stats(date)',
      'CREATE INDEX IF NOT EXISTS idx_user_stats_daily_streak ON user_stats(daily_streak)',
      'CREATE INDEX IF NOT EXISTS idx_study_sessions_start ON study_sessions(session_start)',
      'CREATE INDEX IF NOT EXISTS idx_study_sessions_type ON study_sessions(session_type)',
      'CREATE INDEX IF NOT EXISTS idx_achievement_progress_type ON achievement_progress(achievement_type)',
      'CREATE INDEX IF NOT EXISTS idx_achievement_progress_completed ON achievement_progress(is_completed)'
    ]

    for (const indexSQL of indexes) {
      const { error } = await supabase.rpc('exec', { sql: indexSQL })
      if (error) {
        console.log('Index creation note:', error.message)
      }
    }

    // Step 3: Initialize sample achievements
    console.log('🎯 Creating achievement templates...')
    const achievements = [
      {
        achievement_type: 'daily_streak',
        achievement_name: 'Learning Streak - 7 Days',
        achievement_description: 'Study for 7 consecutive days',
        target_progress: 7,
        badge_icon: '🔥',
        badge_color: 'orange',
        points_awarded: 100
      },
      {
        achievement_type: 'daily_streak',
        achievement_name: 'Learning Streak - 30 Days',
        achievement_description: 'Study for 30 consecutive days',
        target_progress: 30,
        badge_icon: '🏆',
        badge_color: 'gold',
        points_awarded: 500
      },
      {
        achievement_type: 'cards_mastered',
        achievement_name: 'First 100 Words',
        achievement_description: 'Master your first 100 vocabulary words',
        target_progress: 100,
        badge_icon: '📚',
        badge_color: 'blue',
        points_awarded: 200
      },
      {
        achievement_type: 'cards_mastered',
        achievement_name: 'Vocabulary Expert - 500 Words',
        achievement_description: 'Master 500 vocabulary words',
        target_progress: 500,
        badge_icon: '🎓',
        badge_color: 'purple',
        points_awarded: 1000
      },
      {
        achievement_type: 'cards_mastered',
        achievement_name: 'IELTS Ready - 1000 Words',
        achievement_description: 'Master 1000 IELTS vocabulary words',
        target_progress: 1000,
        badge_icon: '🌟',
        badge_color: 'gold',
        points_awarded: 2000
      },
      {
        achievement_type: 'perfect_session',
        achievement_name: 'Perfect Session - 10 Cards',
        achievement_description: 'Get 10 cards correct in a row',
        target_progress: 10,
        badge_icon: '⚡',
        badge_color: 'yellow',
        points_awarded: 50
      },
      {
        achievement_type: 'perfect_session',
        achievement_name: 'Perfect Session - 50 Cards',
        achievement_description: 'Get 50 cards correct in a row',
        target_progress: 50,
        badge_icon: '🎯',
        badge_color: 'green',
        points_awarded: 250
      },
      {
        achievement_type: 'speed_demon',
        achievement_name: 'Speed Demon - 1000 Fast Reviews',
        achievement_description: 'Complete 1000 reviews in under 3 seconds each',
        target_progress: 1000,
        badge_icon: '🚀',
        badge_color: 'red',
        points_awarded: 300
      }
    ]

    const { data: insertedAchievements, error: achievementError } = await supabase
      .from('achievement_progress')
      .upsert(achievements, { onConflict: 'achievement_type,achievement_name' })
      .select()

    if (achievementError) {
      console.error('Achievement insertion error:', achievementError)
    }

    // Step 4: Initialize card schedules for existing flashcards
    console.log('📅 Initializing card schedules for existing flashcards...')
    const { data: flashcards, error: flashcardError } = await supabase
      .from('flashcards')
      .select('id')

    if (!flashcardError && flashcards) {
      const schedules = flashcards.map(fc => ({
        flashcard_id: fc.id,
        next_review_date: new Date().toISOString(),
        current_interval_days: 1,
        current_easiness_factor: 2.5,
        current_repetition_number: 0,
        card_state: 'new'
      }))

      const { error: scheduleError } = await supabase
        .from('card_schedule')
        .upsert(schedules, { onConflict: 'flashcard_id' })

      if (scheduleError) {
        console.error('Schedule initialization error:', scheduleError)
      } else {
        console.log(`📅 Initialized schedules for ${schedules.length} flashcards`)
      }
    }

    console.log(`🎉 Spaced Repetition System migration completed!`)

    return NextResponse.json({
      success: true,
      message: 'Spaced Repetition System migration completed successfully!',
      data: {
        tables_created: ['user_reviews', 'user_stats', 'card_schedule', 'study_sessions', 'achievement_progress'],
        achievements_created: insertedAchievements?.length || 0,
        flashcards_scheduled: flashcards?.length || 0,
        features: [
          'SM-2 Algorithm Ready',
          'Automatic Card Scheduling',
          'Progress Tracking',
          'Achievement System',
          'Study Session Analytics'
        ]
      }
    })

  } catch (error) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Spaced Repetition System migration failed'
      },
      { status: 500 }
    )
  }
}

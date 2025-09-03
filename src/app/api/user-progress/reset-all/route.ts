import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting global user progress reset to Day 1, Week 1...')

    // First, check if user_progress table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_progress')

    if (tableError) {
      console.error('Error checking table existence:', tableError)
    }

    // Create user_progress table if it doesn't exist
    if (!tables || tables.length === 0) {
      console.log('📊 Creating user_progress table...')
      
      const { error: createError } = await supabase.rpc('create_user_progress_table', {})
      
      if (createError) {
        console.log('Creating table via SQL...')
        // Fallback: create table via direct SQL
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS user_progress (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id VARCHAR(255) UNIQUE,
            current_week INTEGER DEFAULT 1,
            current_day INTEGER DEFAULT 1,
            total_days_studied INTEGER DEFAULT 0,
            total_words_learned INTEGER DEFAULT 0,
            current_phase VARCHAR(50) DEFAULT 'Foundation',
            last_study_date TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
        `
        
        const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
        if (sqlError) {
          console.error('Failed to create table:', sqlError)
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to create user_progress table',
            details: sqlError
          }, { status: 500 })
        }
      }
    }

    // Reset all existing user progress to Day 1, Week 1
    console.log('🔄 Resetting all user progress...')
    
    const { data: resetData, error: resetError } = await supabase
      .from('user_progress')
      .update({
        current_week: 1,
        current_day: 1,
        current_phase: 'Foundation',
        updated_at: new Date().toISOString(),
        last_study_date: new Date().toISOString()
      })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Update all records

    if (resetError) {
      console.error('Error resetting user progress:', resetError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to reset user progress',
        details: resetError
      }, { status: 500 })
    }

    // Also reset daily lesson progress if it exists
    console.log('📚 Resetting daily lesson progress...')
    
    const { error: dailyResetError } = await supabase
      .from('daily_lesson_progress')
      .update({
        is_completed: false,
        words_learned: 0,
        completion_date: null,
        updated_at: new Date().toISOString()
      })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Update all records

    if (dailyResetError) {
      console.log('Daily lesson progress table may not exist yet:', dailyResetError.message)
    }

    // Get count of affected users
    const { data: userCount, error: countError } = await supabase
      .from('user_progress')
      .select('id', { count: 'exact' })

    const affectedUsers = userCount?.length || 0

    console.log(`✅ Successfully reset ${affectedUsers} user(s) to Day 1, Week 1`)

    return NextResponse.json({
      success: true,
      message: `Successfully reset all users to Day 1, Week 1`,
      affected_users: affectedUsers,
      reset_to: {
        week: 1,
        day: 1,
        phase: 'Foundation'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Unexpected error during global reset:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
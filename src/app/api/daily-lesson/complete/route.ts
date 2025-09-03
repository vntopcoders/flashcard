import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      day_number, 
      words_learned = 20, 
      study_time_minutes = 30, 
      accuracy_percentage = 85.0,
      grammar_completed = false,
      skills_practiced = ['vocabulary']
    } = body

    console.log('📚 Marking daily lesson as completed:', { user_id, day_number, words_learned })

    if (!user_id || !day_number) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: user_id and day_number' 
      }, { status: 400 })
    }

    const week_number = Math.ceil(day_number / 7)

    // Determine phase based on week
    let phase = 'Foundation'
    if (week_number > 12) phase = 'Development'
    if (week_number > 24) phase = 'Mastery'
    if (week_number > 32) phase = 'Expert'

    // First, ensure user progress exists
    const { error: upsertUserError } = await supabase
      .from('user_progress')
      .upsert({
        user_id,
        current_week: Math.max(week_number, 1),
        current_day: Math.max(day_number, 1),
        current_phase: phase,
        last_study_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (upsertUserError) {
      console.error('Error upserting user progress:', upsertUserError)
    }

    // Mark daily lesson as completed
    const { data: completedLesson, error: completionError } = await supabase
      .from('daily_lesson_progress')
      .upsert({
        user_id,
        day_number,
        week_number,
        words_learned,
        words_target: 20,
        grammar_completed,
        skills_practiced,
        is_completed: true,
        completion_date: new Date().toISOString(),
        study_time_minutes,
        accuracy_percentage,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,day_number'
      })
      .select()

    if (completionError) {
      console.error('Error marking lesson as completed:', completionError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to mark lesson as completed',
        details: completionError
      }, { status: 500 })
    }

    // Update overall user progress
    const { error: progressUpdateError } = await supabase
      .from('user_progress')
      .update({
        current_day: Math.max(day_number + 1, day_number),
        current_week: Math.ceil(Math.max(day_number + 1, day_number) / 7),
        total_days_studied: supabase.raw('total_days_studied + 1'),
        total_words_learned: supabase.raw(`total_words_learned + ${words_learned}`),
        last_study_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)

    if (progressUpdateError) {
      console.error('Error updating user progress:', progressUpdateError)
    }

    // Calculate achievements/streak (simplified)
    const nextDay = day_number + 1
    const nextWeek = Math.ceil(nextDay / 7)
    const nextPhase = nextWeek <= 12 ? 'Foundation' : 
                     nextWeek <= 24 ? 'Development' : 
                     nextWeek <= 32 ? 'Mastery' : 'Expert'

    // Check if week is completed (7 days)
    const { data: weekProgress } = await supabase
      .from('daily_lesson_progress')
      .select('day_number')
      .eq('user_id', user_id)
      .eq('week_number', week_number)
      .eq('is_completed', true)

    const weekCompleted = weekProgress && weekProgress.length >= 7

    console.log('✅ Daily lesson completed successfully:', {
      user_id,
      day: day_number,
      week: week_number,
      phase,
      words_learned,
      week_completed: weekCompleted
    })

    return NextResponse.json({
      success: true,
      message: `Day ${day_number} completed successfully!`,
      data: {
        completed_lesson: completedLesson?.[0],
        day_completed: day_number,
        week_completed: weekCompleted,
        words_learned,
        next_day: nextDay <= 252 ? nextDay : null,
        next_week: nextWeek <= 36 ? nextWeek : null,
        next_phase: nextPhase,
        progress: {
          current_day: nextDay <= 252 ? nextDay : day_number,
          current_week: nextWeek <= 36 ? nextWeek : week_number,
          current_phase: nextDay <= 252 ? nextPhase : phase,
          total_progress: Math.round((day_number / 252) * 100)
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Unexpected error in daily lesson completion:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check completion status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const day_number = searchParams.get('day_number')

    if (!user_id || !day_number) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: user_id and day_number' 
      }, { status: 400 })
    }

    const { data: lessonProgress, error } = await supabase
      .from('daily_lesson_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('day_number', parseInt(day_number))
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking lesson completion:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to check lesson completion' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      is_completed: lessonProgress?.is_completed || false,
      data: lessonProgress,
      day_number: parseInt(day_number)
    })

  } catch (error) {
    console.error('Unexpected error checking completion:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred' 
    }, { status: 500 })
  }
}
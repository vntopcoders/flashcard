import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing user_id' 
      }, { status: 400 })
    }

    console.log('🔄 Syncing user progress for:', user_id)

    // Get all completed daily lessons for this user
    const { data: completedLessons, error: lessonsError } = await supabase
      .from('daily_lesson_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_completed', true)
      .order('day_number', { ascending: true })

    if (lessonsError) {
      console.error('Error fetching completed lessons:', lessonsError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch completed lessons' 
      }, { status: 500 })
    }

    if (!completedLessons || completedLessons.length === 0) {
      console.log('No completed lessons found for user:', user_id)
      return NextResponse.json({
        success: true,
        message: 'No completed lessons to sync',
        data: { synced_lessons: 0 }
      })
    }

    // Calculate totals from completed lessons
    const totalDaysStudied = completedLessons.length
    const totalWordsLearned = completedLessons.reduce((sum, lesson) => sum + (lesson.words_learned || 0), 0)
    const lastCompletedDay = Math.max(...completedLessons.map(l => l.day_number))
    const currentDay = lastCompletedDay + 1
    const currentWeek = Math.ceil(currentDay / 7)
    
    // Determine current phase
    let currentPhase = 'Foundation'
    if (currentWeek > 12) currentPhase = 'Development'
    if (currentWeek > 24) currentPhase = 'Mastery'
    if (currentWeek > 32) currentPhase = 'Expert'

    // Get last study date
    const lastStudyDate = completedLessons[completedLessons.length - 1]?.completion_date

    console.log('📊 Calculated progress:', {
      totalDaysStudied,
      totalWordsLearned,
      currentDay,
      currentWeek,
      currentPhase,
      lastStudyDate
    })

    // Upsert user progress
    const { data: upsertedProgress, error: upsertError } = await supabase
      .from('user_progress')
      .upsert({
        user_id,
        current_week: currentWeek,
        current_day: currentDay,
        total_days_studied: totalDaysStudied,
        total_words_learned: totalWordsLearned,
        current_phase: currentPhase,
        last_study_date: lastStudyDate,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (upsertError) {
      console.error('Error upserting user progress:', upsertError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to sync user progress',
        details: upsertError
      }, { status: 500 })
    }

    console.log('✅ User progress synced successfully:', upsertedProgress?.[0])

    return NextResponse.json({
      success: true,
      message: `Synced progress for ${totalDaysStudied} completed days`,
      data: {
        user_id,
        synced_lessons: totalDaysStudied,
        total_words_learned: totalWordsLearned,
        current_day: currentDay,
        current_week: currentWeek,
        current_phase: currentPhase,
        user_progress: upsertedProgress?.[0]
      }
    })

  } catch (error) {
    console.error('Unexpected error syncing progress:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing user_id parameter' 
      }, { status: 400 })
    }

    // Get user progress
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user_id)
      .single()

    // Get completed lessons count
    const { data: completedLessons } = await supabase
      .from('daily_lesson_progress')
      .select('day_number, words_learned')
      .eq('user_id', user_id)
      .eq('is_completed', true)

    const completedCount = completedLessons?.length || 0
    const totalWords = completedLessons?.reduce((sum, l) => sum + (l.words_learned || 0), 0) || 0

    return NextResponse.json({
      success: true,
      data: {
        user_progress: userProgress,
        completed_lessons_count: completedCount,
        total_words_from_lessons: totalWords,
        needs_sync: !userProgress || 
                   userProgress.total_days_studied !== completedCount ||
                   userProgress.total_words_learned !== totalWords
      }
    })

  } catch (error) {
    console.error('Error checking sync status:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check sync status' 
    }, { status: 500 })
  }
}
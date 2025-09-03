import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

    console.log('📚 Fetching completed lessons for user:', user_id)

    // Get all completed daily lessons for this user
    const { data: completedLessons, error } = await supabase
      .from('daily_lesson_progress')
      .select('day_number, words_learned, completion_date, accuracy_percentage')
      .eq('user_id', user_id)
      .eq('is_completed', true)
      .order('day_number', { ascending: true })

    if (error) {
      console.error('Error fetching completed lessons:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch completed lessons',
        details: error
      }, { status: 500 })
    }

    const completedDays = completedLessons?.map(lesson => lesson.day_number) || []
    const totalWordsLearned = completedLessons?.reduce((sum, lesson) => sum + (lesson.words_learned || 0), 0) || 0

    console.log('✅ Found completed lessons:', {
      user_id,
      total_completed: completedDays.length,
      completed_days: completedDays,
      total_words: totalWordsLearned
    })

    return NextResponse.json({
      success: true,
      data: {
        user_id,
        completed_days: completedDays,
        completed_lessons: completedLessons,
        total_completed: completedDays.length,
        total_words_learned: totalWordsLearned,
        latest_completion: completedLessons?.[completedLessons.length - 1]?.completion_date
      }
    })

  } catch (error) {
    console.error('Unexpected error fetching completed lessons:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
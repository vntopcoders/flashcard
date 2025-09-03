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

    console.log('🚀 Initializing user progress for:', user_id)

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (existingUser) {
      console.log('✅ User already initialized:', user_id)
      return NextResponse.json({
        success: true,
        message: 'User already initialized',
        data: { user_progress: existingUser, is_new_user: false }
      })
    }

    // Initialize user progress
    const { data: newUser, error: initError } = await supabase
      .from('user_progress')
      .insert([{
        user_id,
        current_week: 1,
        current_day: 1,
        total_days_studied: 0,
        total_words_learned: 0,
        current_phase: 'Foundation',
        study_streak: 0,
        longest_streak: 0,
        target_score: 8.0,
        current_estimated_score: 5.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (initError) {
      console.error('Error initializing user:', initError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to initialize user',
        details: initError
      }, { status: 500 })
    }

    console.log('✅ User initialized successfully:', newUser?.[0])

    return NextResponse.json({
      success: true,
      message: 'User initialized successfully',
      data: { 
        user_progress: newUser?.[0], 
        is_new_user: true,
        next_action: 'User can now start daily lessons'
      }
    })

  } catch (error) {
    console.error('Unexpected error initializing user:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check if user exists
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

    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user_id)
      .single()

    const { data: completedLessons } = await supabase
      .from('daily_lesson_progress')
      .select('day_number')
      .eq('user_id', user_id)
      .eq('is_completed', true)

    return NextResponse.json({
      success: true,
      data: {
        user_exists: !!userProgress,
        user_progress: userProgress,
        completed_lessons_count: completedLessons?.length || 0,
        needs_initialization: !userProgress
      }
    })

  } catch (error) {
    console.error('Error checking user:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check user status' 
    }, { status: 500 })
  }
}
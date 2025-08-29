import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Reset user progress to week 1
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.email,
        current_week: 1,
        current_day: 1,
        vocabulary_learned: 0,
        grammar_completed: 0,
        mock_tests_completed: 0,
        study_days: 0,
        current_streak: 0,
        total_points: 0,
        level: 1,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Reset progress error:', error)
      return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Progress reset to week 1 successfully' 
    })
  } catch (error) {
    console.error('Reset progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
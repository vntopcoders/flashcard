import { NextRequest, NextResponse } from 'next/server'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'

// Start a new study session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_type, lesson_focus } = body
    
    const session = await SpacedRepetitionService.startStudySession(
      session_type || 'mixed',
      lesson_focus
    )
    
    return NextResponse.json({
      success: true,
      message: 'Study session started',
      session
    })
    
  } catch (error) {
    console.error('Failed to start study session:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to start study session'
      },
      { status: 500 }
    )
  }
}

// End a study session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, results } = body
    
    if (!session_id || !results) {
      return NextResponse.json(
        { success: false, error: 'Missing session_id or results' },
        { status: 400 }
      )
    }
    
    const session = await SpacedRepetitionService.endStudySession(session_id, results)
    
    return NextResponse.json({
      success: true,
      message: 'Study session completed',
      session,
      summary: {
        cards_studied: results.cards_studied,
        accuracy: session.accuracy_rate,
        duration_minutes: session.total_duration_ms 
          ? Math.round(session.total_duration_ms / 60000) 
          : 0
      }
    })
    
  } catch (error) {
    console.error('Failed to end study session:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to end study session'
      },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // For development purposes, this endpoint simulates a progress reset
    // The actual progress is handled by the frontend StudyPlan component with mock data
    
    const body = await request.json().catch(() => ({}))
    const userEmail = body.userEmail || 'demo@example.com'
    
    // Simulate successful reset
    // In a real application, this would reset the user's progress in the database
    console.log(`Progress reset requested for user: ${userEmail}`)
    
    // For now, just return success since StudyPlan uses mock data
    return NextResponse.json({ 
      success: true, 
      message: 'Progress reset to week 1 successfully (mock implementation)',
      userId: userEmail,
      resetData: {
        current_week: 1,
        current_day: 1,
        vocabulary_learned: 650,
        grammar_completed: 25,
        mock_tests_completed: 8,
        study_days: 22,
        current_streak: 7,
        total_points: 0,
        level: 1
      }
    })
  } catch (error) {
    console.error('Reset progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Add GET method for easier testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to reset progress',
    example: {
      method: 'POST',
      body: { userEmail: 'your-email@example.com' }
    }
  })
}
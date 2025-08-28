import { NextResponse } from 'next/server'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'

export async function GET() {
  try {
    const schedule = await SpacedRepetitionService.getStudySchedule()
    
    return NextResponse.json({
      success: true,
      schedule,
      recommendations: {
        session_type: schedule.recommendedSession.type,
        card_count: schedule.recommendedSession.cardCount,
        reason: schedule.recommendedSession.reason
      }
    })
    
  } catch (error) {
    console.error('Failed to get study schedule:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get study schedule'
      },
      { status: 500 }
    )
  }
}
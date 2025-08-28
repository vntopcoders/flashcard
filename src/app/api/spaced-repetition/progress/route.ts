import { NextResponse } from 'next/server'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'

export async function GET() {
  try {
    const progress = await SpacedRepetitionService.getLearningProgress()
    
    return NextResponse.json({
      success: true,
      progress,
      summary: {
        total_cards: progress.cardStates.reduce((sum: number, state: { count?: number }) => sum + (state.count || 0), 0),
        cards_due_today: progress.dueToday,
        recent_activity: progress.recentStats.length
      }
    })
    
  } catch (error) {
    console.error('Failed to get learning progress:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get learning progress'
      },
      { status: 500 }
    )
  }
}
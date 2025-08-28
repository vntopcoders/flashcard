import { NextRequest, NextResponse } from 'next/server'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flashcard_id, quality, response_time_ms } = body
    
    // Validate input
    if (!flashcard_id || typeof quality !== 'number' || quality < 0 || quality > 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid review data. Quality must be 0-5.' },
        { status: 400 }
      )
    }
    
    // Process the review
    const updatedSchedule = await SpacedRepetitionService.processReview({
      flashcard_id,
      quality,
      response_time_ms: response_time_ms || 0,
      reviewed_at: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: 'Review processed successfully',
      schedule: updatedSchedule,
      next_review: updatedSchedule.next_review_date,
      interval_days: updatedSchedule.current_interval_days,
      easiness_factor: updatedSchedule.current_easiness_factor,
      card_state: updatedSchedule.card_state
    })
    
  } catch (error) {
    console.error('Failed to process review:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process review'
      },
      { status: 500 }
    )
  }
}
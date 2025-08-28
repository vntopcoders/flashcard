import { NextRequest, NextResponse } from 'next/server'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const cardsDue = await SpacedRepetitionService.getCardsDueForReview(limit)
    
    return NextResponse.json({
      success: true,
      cards: cardsDue,
      count: cardsDue.length
    })
    
  } catch (error) {
    console.error('Failed to get cards due:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get cards due for review'
      },
      { status: 500 }
    )
  }
}
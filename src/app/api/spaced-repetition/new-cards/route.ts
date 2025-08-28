import { NextRequest, NextResponse } from 'next/server'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const newCards = await SpacedRepetitionService.getNewCards(limit)
    
    return NextResponse.json({
      success: true,
      cards: newCards,
      count: newCards.length
    })
    
  } catch (error) {
    console.error('Failed to get new cards:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get new cards'
      },
      { status: 500 }
    )
  }
}
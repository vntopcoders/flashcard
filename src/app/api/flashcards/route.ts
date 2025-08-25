import { NextRequest, NextResponse } from 'next/server'
import { flashcardDb } from '@/lib/supabase'

export async function GET() {
  try {
    const flashcards = await flashcardDb.getAll()
    return NextResponse.json(flashcards)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { english, vietnamese, category, difficulty } = body

    if (!english || !vietnamese) {
      return NextResponse.json(
        { error: 'English and Vietnamese translations are required' },
        { status: 400 }
      )
    }

    const flashcard = await flashcardDb.create({
      english,
      vietnamese,
      category: category || 'general',
      difficulty: difficulty || 1
    })

    return NextResponse.json(flashcard, { status: 201 })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to create flashcard' },
      { status: 500 }
    )
  }
}

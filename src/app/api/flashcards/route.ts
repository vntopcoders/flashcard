import { NextRequest, NextResponse } from 'next/server'
import { flashcardDb } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lesson')
    
    const flashcards = lessonId 
      ? await flashcardDb.getByLessonId(lessonId)
      : await flashcardDb.getAll()
      
    return NextResponse.json(flashcards)
  } catch (error) {
    console.error('Failed to fetch flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { english, vietnamese, category, difficulty, lesson_id } = body

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
      difficulty: difficulty || 1,
      lesson_id: lesson_id || null
    })

    return NextResponse.json(flashcard, { status: 201 })
  } catch (error) {
    console.error('Failed to create flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to create flashcard' },
      { status: 500 }
    )
  }
}

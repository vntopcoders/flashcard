import { NextRequest, NextResponse } from 'next/server'
import { flashcardDb } from '@/lib/supabase'

interface Params {
  id: string
}

export async function GET(
  _request: NextRequest,
  props: { params: Promise<Params> }
) {
  try {
    const params = await props.params
    const flashcard = await flashcardDb.getById(params.id)

    if (!flashcard) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Failed to fetch flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flashcard' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<Params> }
) {
  try {
    const params = await props.params
    const body = await request.json()
    const { english, vietnamese, category, difficulty, lesson_id } = body

    const flashcard = await flashcardDb.update(params.id, {
      english,
      vietnamese,
      category,
      difficulty,
      lesson_id: lesson_id || null
    })

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Failed to update flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<Params> }
) {
  try {
    const params = await props.params
    await flashcardDb.delete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to delete flashcard' },
      { status: 500 }
    )
  }
}

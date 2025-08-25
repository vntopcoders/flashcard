import { NextRequest, NextResponse } from 'next/server'
import { lessonDb } from '@/lib/supabase'

interface Params {
  id: string
}

export async function GET(
  _request: NextRequest,
  props: { params: Promise<Params> }
) {
  try {
    const params = await props.params
    const lesson = await lessonDb.getById(params.id)
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    const flashcardCount = await lessonDb.getFlashcardCount(lesson.id)
    
    return NextResponse.json({
      ...lesson,
      flashcard_count: flashcardCount
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
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
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Lesson name is required' },
        { status: 400 }
      )
    }

    const lesson = await lessonDb.update(params.id, {
      name,
      description: description || null,
      color: color || '#3B82F6'
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    const flashcardCount = await lessonDb.getFlashcardCount(lesson.id)

    return NextResponse.json({
      ...lesson,
      flashcard_count: flashcardCount
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update lesson' },
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
    
    // Check if lesson has flashcards
    const flashcardCount = await lessonDb.getFlashcardCount(params.id)
    if (flashcardCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete lesson that contains flashcards' },
        { status: 400 }
      )
    }

    const success = await lessonDb.delete(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    )
  }
}

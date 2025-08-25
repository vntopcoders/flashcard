import { NextRequest, NextResponse } from 'next/server'
import { lessonDb } from '@/lib/supabase'

export async function GET() {
  try {
    const lessons = await lessonDb.getAll()
    
    // Get flashcard count for each lesson
    const lessonsWithCount = await Promise.all(
      lessons.map(async (lesson) => {
        const flashcardCount = await lessonDb.getFlashcardCount(lesson.id)
        return {
          ...lesson,
          flashcard_count: flashcardCount
        }
      })
    )
    
    return NextResponse.json(lessonsWithCount)
  } catch (error) {
    console.error('Failed to fetch lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Lesson name is required' },
        { status: 400 }
      )
    }

    const lesson = await lessonDb.create({
      name,
      description: description || null,
      color: color || '#3B82F6'
    })

    return NextResponse.json({
      ...lesson,
      flashcard_count: 0
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create lesson:', error)
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
}

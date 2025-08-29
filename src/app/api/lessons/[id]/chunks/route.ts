import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const url = new URL(request.url)
    const chunkSize = parseInt(url.searchParams.get('size') || '20')

    // First get the lesson info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Get all flashcards for this lesson
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('lesson_id', id)
      .order('english')

    if (flashcardsError) {
      return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 })
    }

    // Split flashcards into chunks
    const chunks = []
    for (let i = 0; i < flashcards.length; i += chunkSize) {
      const chunkFlashcards = flashcards.slice(i, i + chunkSize)
      chunks.push({
        id: `${lesson.id}-chunk-${Math.floor(i / chunkSize) + 1}`,
        name: `${lesson.name} - Part ${Math.floor(i / chunkSize) + 1}`,
        description: `${lesson.description} (${chunkFlashcards.length} words)`,
        color: lesson.color,
        flashcard_count: chunkFlashcards.length,
        chunk_number: Math.floor(i / chunkSize) + 1,
        total_chunks: Math.ceil(flashcards.length / chunkSize),
        parent_lesson: lesson,
        flashcards: chunkFlashcards
      })
    }

    return NextResponse.json(chunks)
  } catch (error) {
    console.error('Error creating lesson chunks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
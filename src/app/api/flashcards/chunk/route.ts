import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const chunkId = url.searchParams.get('id')
    
    if (!chunkId) {
      return NextResponse.json({ error: 'Chunk ID is required' }, { status: 400 })
    }

    // Parse chunk ID to extract lesson ID and chunk number
    const match = chunkId.match(/^(.+)-chunk-(\d+)$/)
    if (!match) {
      return NextResponse.json({ error: 'Invalid chunk ID format' }, { status: 400 })
    }

    const [, lessonId, chunkNumberStr] = match
    const chunkNumber = parseInt(chunkNumberStr)
    const chunkSize = parseInt(url.searchParams.get('size') || '20')
    const offset = (chunkNumber - 1) * chunkSize

    // Get lesson info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Get flashcards for this chunk
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select(`
        *,
        lesson:lessons(*)
      `)
      .eq('lesson_id', lessonId)
      .order('english')
      .range(offset, offset + chunkSize - 1)

    if (flashcardsError) {
      return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 })
    }

    return NextResponse.json(flashcards)
  } catch (error) {
    console.error('Error fetching chunk flashcards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
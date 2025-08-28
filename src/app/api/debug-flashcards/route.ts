import { NextRequest, NextResponse } from 'next/server'
import { flashcardDb } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lesson')

    console.log('Debug - Received lessonId:', lessonId)
    console.log('Debug - URL searchParams:', Object.fromEntries(searchParams.entries()))

    if (lessonId) {
      console.log('Debug - Getting flashcards for lesson:', lessonId)
      const flashcards = await flashcardDb.getByLessonId(lessonId)
      console.log('Debug - Found flashcards:', flashcards.length)
      console.log('Debug - Sample flashcard lesson_ids:', flashcards.slice(0, 3).map(f => f.lesson_id))
      
      return NextResponse.json({
        debug: true,
        receivedLessonId: lessonId,
        flashcardCount: flashcards.length,
        flashcards: flashcards.slice(0, 5), // Return first 5 for inspection
        sampleLessonIds: flashcards.slice(0, 10).map(f => f.lesson_id)
      })
    } else {
      console.log('Debug - Getting all flashcards')
      const allFlashcards = await flashcardDb.getAll()
      console.log('Debug - Total flashcards:', allFlashcards.length)
      
      return NextResponse.json({
        debug: true,
        receivedLessonId: null,
        totalFlashcards: allFlashcards.length,
        flashcards: allFlashcards.slice(0, 5),
        uniqueLessonIds: [...new Set(allFlashcards.map(f => f.lesson_id))].slice(0, 10)
      })
    }
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Debug API failed', details: error },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { lessonDb, flashcardDb } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test getting all lessons
    const lessons = await lessonDb.getAll()
    console.log('✅ Lessons found:', lessons.length)
    
    // Test getting all flashcards  
    const flashcards = await flashcardDb.getAll()
    console.log('✅ Flashcards found:', flashcards.length)
    
    return NextResponse.json({
      success: true,
      message: 'Connection test successful',
      data: {
        lessons_count: lessons.length,
        flashcards_count: flashcards.length,
        lessons: lessons.slice(0, 3), // First 3 lessons for debugging
        flashcards: flashcards.slice(0, 3) // First 3 flashcards for debugging
      }
    })

  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        message: 'Failed to connect to database'
      },
      { status: 500 }
    )
  }
}

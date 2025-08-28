import { NextResponse } from 'next/server'
import { flashcardDb, lessonDb } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Testing simple flashcard creation (no IPA)...')
    
    // Get lessons first
    const lessons = await lessonDb.getAll()
    console.log('Found lessons:', lessons.length)
    
    if (lessons.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No lessons found. Create lessons first.'
      })
    }

    const firstLesson = lessons[0]
    console.log('Using lesson:', firstLesson.name, 'ID:', firstLesson.id)

    // Try to create flashcard WITHOUT IPA
    const testFlashcard = await flashcardDb.create({
      english: 'simple-test-' + Date.now(),
      vietnamese: 'thử nghiệm đơn giản',
      category: 'test',
      difficulty: 1,
      lesson_id: firstLesson.id
      // No IPA field
    })

    console.log('✅ Simple flashcard created:', testFlashcard)

    return NextResponse.json({
      success: true,
      message: 'Simple flashcard created successfully!',
      data: testFlashcard
    })

  } catch (error) {
    console.error('❌ Simple test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        message: 'Failed to create simple flashcard'
      },
      { status: 500 }
    )
  }
}

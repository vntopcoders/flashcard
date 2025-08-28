import { NextResponse } from 'next/server'
import { flashcardDb, lessonDb } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Testing flashcard creation...')
    
    // First get a lesson to use
    const lessons = await lessonDb.getAll()
    console.log('Found lessons:', lessons.length)
    
    if (lessons.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No lessons found. Need to create lessons first.'
      })
    }

    const firstLesson = lessons[0]
    console.log('Using lesson:', firstLesson.name, 'ID:', firstLesson.id)

    // Try to create a test flashcard
    const testFlashcard = await flashcardDb.create({
      english: 'test-word-' + Date.now(),
      vietnamese: 'từ thử nghiệm',
      ipa: '/test/',
      category: 'test',
      difficulty: 1,
      lesson_id: firstLesson.id
    })

    console.log('✅ Flashcard created successfully:', testFlashcard)

    return NextResponse.json({
      success: true,
      message: 'Test flashcard created successfully!',
      data: {
        lesson_used: firstLesson,
        created_flashcard: testFlashcard
      }
    })

  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        message: 'Failed to create test flashcard'
      },
      { status: 500 }
    )
  }
}

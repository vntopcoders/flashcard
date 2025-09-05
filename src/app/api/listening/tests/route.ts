import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/listening/tests - Get all listening tests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const testType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('listening_tests')
      .select(`
        id,
        title, 
        audio_url,
        duration,
        difficulty,
        test_type,
        description,
        instructions,
        total_questions,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    if (testType) {
      query = query.eq('test_type', testType)
    }

    const { data: tests, error } = await query

    if (error) {
      console.error('Error fetching listening tests:', error)
      return NextResponse.json({ error: 'Failed to fetch tests', details: error }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      tests: tests || [],
      count: tests?.length || 0
    })

  } catch (error) {
    console.error('Get listening tests error:', error)
    return NextResponse.json({ 
      error: 'Failed to get tests',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// POST /api/listening/tests - Create new listening test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      audio_url,
      audio_transcript,
      duration,
      difficulty = 'intermediate',
      test_type = 'practice',
      description,
      instructions,
      questions = []
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Create the test first
    const { data: test, error: testError } = await supabase
      .from('listening_tests')
      .insert([{
        title,
        audio_url,
        audio_transcript,
        duration,
        difficulty,
        test_type,
        description,
        instructions,
        total_questions: questions.length
      }])
      .select()
      .single()

    if (testError) {
      console.error('Error creating listening test:', testError)
      return NextResponse.json({ error: 'Failed to create test', details: testError }, { status: 500 })
    }

    // Add questions if provided
    if (questions.length > 0) {
      const questionsWithTestId = questions.map((q: {
        part_number?: number
        question_number?: number
        question_type?: string
        question_text: string
        options?: string[]
        correct_answer: string
        explanation?: string
        audio_timestamp?: number
        audio_end_timestamp?: number
        points?: number
      }, index: number) => ({
        test_id: test.id,
        part_number: q.part_number || 1,
        question_number: q.question_number || (index + 1),
        question_type: q.question_type || 'multiple_choice',
        question_text: q.question_text,
        options: q.options || null,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        audio_timestamp: q.audio_timestamp || null,
        audio_end_timestamp: q.audio_end_timestamp || null,
        points: q.points || 1
      }))

      const { error: questionsError } = await supabase
        .from('listening_questions')
        .insert(questionsWithTestId)

      if (questionsError) {
        console.error('Error creating questions:', questionsError)
        // Rollback test creation
        await supabase.from('listening_tests').delete().eq('id', test.id)
        return NextResponse.json({ error: 'Failed to create questions', details: questionsError }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      test,
      message: `Test "${title}" created successfully with ${questions.length} questions`
    })

  } catch (error) {
    console.error('Create listening test error:', error)
    return NextResponse.json({ 
      error: 'Failed to create test',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
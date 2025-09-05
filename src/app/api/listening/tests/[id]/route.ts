import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/listening/tests/[id] - Get specific listening test with questions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id)
    
    if (isNaN(testId)) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 })
    }

    // Get test details
    const { data: test, error: testError } = await supabase
      .from('listening_tests')
      .select('*')
      .eq('id', testId)
      .single()

    if (testError) {
      console.error('Error fetching test:', testError)
      return NextResponse.json({ error: 'Test not found', details: testError }, { status: 404 })
    }

    // Get questions for this test
    const { data: questions, error: questionsError } = await supabase
      .from('listening_questions')
      .select('*')
      .eq('test_id', testId)
      .order('part_number')
      .order('question_number')

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
      return NextResponse.json({ error: 'Failed to fetch questions', details: questionsError }, { status: 500 })
    }

    // Group questions by part
    const questionsByPart = (questions || []).reduce((acc: Record<string, typeof questions>, question) => {
      const part = `part${question.part_number}`
      if (!acc[part]) {
        acc[part] = []
      }
      acc[part].push(question)
      return acc
    }, {})

    return NextResponse.json({ 
      success: true, 
      test,
      questions: questions || [],
      questionsByPart,
      totalQuestions: questions?.length || 0
    })

  } catch (error) {
    console.error('Get test details error:', error)
    return NextResponse.json({ 
      error: 'Failed to get test details',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// PUT /api/listening/tests/[id] - Update listening test
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(testId)) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 })
    }

    const {
      title,
      audio_url,
      audio_transcript,
      duration,
      difficulty,
      test_type,
      description,
      instructions
    } = body

    const { data: test, error } = await supabase
      .from('listening_tests')
      .update({
        title,
        audio_url,
        audio_transcript,
        duration,
        difficulty,
        test_type,
        description,
        instructions,
        updated_at: new Date().toISOString()
      })
      .eq('id', testId)
      .select()
      .single()

    if (error) {
      console.error('Error updating test:', error)
      return NextResponse.json({ error: 'Failed to update test', details: error }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      test,
      message: 'Test updated successfully'
    })

  } catch (error) {
    console.error('Update test error:', error)
    return NextResponse.json({ 
      error: 'Failed to update test',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// DELETE /api/listening/tests/[id] - Delete listening test
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id)
    
    if (isNaN(testId)) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 })
    }

    // Delete test (questions will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('listening_tests')
      .delete()
      .eq('id', testId)

    if (error) {
      console.error('Error deleting test:', error)
      return NextResponse.json({ error: 'Failed to delete test', details: error }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test deleted successfully'
    })

  } catch (error) {
    console.error('Delete test error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete test',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
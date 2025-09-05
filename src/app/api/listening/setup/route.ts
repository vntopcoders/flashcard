import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Setting up Listening database schema...')

    // Create listening_tests table
    const { error: testsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS listening_tests (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          audio_url TEXT,
          audio_transcript TEXT,
          duration INTEGER, -- seconds
          difficulty VARCHAR(20) DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced'
          test_type VARCHAR(50) DEFAULT 'practice', -- 'practice', 'mock_exam', 'skill_focus'
          description TEXT,
          instructions TEXT,
          total_questions INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    })

    if (testsError) {
      console.error('Error creating listening_tests table:', testsError)
      return NextResponse.json({ error: 'Failed to create listening_tests table', details: testsError }, { status: 500 })
    }

    // Create listening_questions table
    const { error: questionsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS listening_questions (
          id SERIAL PRIMARY KEY,
          test_id INTEGER REFERENCES listening_tests(id) ON DELETE CASCADE,
          part_number INTEGER NOT NULL, -- 1, 2, 3, 4
          question_number INTEGER NOT NULL,
          question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'fill_blank', 'matching', 'map_labeling', 'diagram'
          question_text TEXT NOT NULL,
          options JSONB, -- for multiple choice and matching
          correct_answer TEXT NOT NULL,
          explanation TEXT,
          audio_timestamp INTEGER, -- when question starts in audio (seconds)
          audio_end_timestamp INTEGER, -- when question ends in audio (seconds)
          points INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    })

    if (questionsError) {
      console.error('Error creating listening_questions table:', questionsError)
      return NextResponse.json({ error: 'Failed to create listening_questions table', details: questionsError }, { status: 500 })
    }

    // Create listening_progress table
    const { error: progressError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS listening_progress (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL, -- from auth
          test_id INTEGER REFERENCES listening_tests(id) ON DELETE CASCADE,
          answers JSONB NOT NULL, -- {"1": "A", "2": "library", ...}
          score INTEGER DEFAULT 0, -- number of correct answers
          total_questions INTEGER DEFAULT 0,
          percentage DECIMAL(5,2) DEFAULT 0,
          band_score DECIMAL(2,1) DEFAULT 0,
          time_taken INTEGER, -- seconds
          part_scores JSONB, -- {"part1": 7, "part2": 8, ...}
          incorrect_answers JSONB, -- detailed wrong answers for review
          started_at TIMESTAMP,
          completed_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    })

    if (progressError) {
      console.error('Error creating listening_progress table:', progressError)
      return NextResponse.json({ error: 'Failed to create listening_progress table', details: progressError }, { status: 500 })
    }

    // Create indexes for better performance
    const { error: indexError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_listening_questions_test_id ON listening_questions(test_id);
        CREATE INDEX IF NOT EXISTS idx_listening_questions_part ON listening_questions(part_number);
        CREATE INDEX IF NOT EXISTS idx_listening_progress_user ON listening_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_listening_progress_test ON listening_progress(test_id);
        CREATE INDEX IF NOT EXISTS idx_listening_progress_completed ON listening_progress(completed_at);
      `
    })

    if (indexError) {
      console.error('Error creating indexes:', indexError)
      return NextResponse.json({ error: 'Failed to create indexes', details: indexError }, { status: 500 })
    }

    console.log('Listening database schema created successfully!')

    return NextResponse.json({ 
      success: true, 
      message: 'Listening database schema created successfully',
      tables: ['listening_tests', 'listening_questions', 'listening_progress'],
      indexes: ['idx_listening_questions_test_id', 'idx_listening_questions_part', 'idx_listening_progress_user', 'idx_listening_progress_test', 'idx_listening_progress_completed']
    })

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ 
      error: 'Database setup failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// Get database schema info
export async function GET() {
  try {
    // Check if tables exist by trying to query them
    const tableChecks = await Promise.allSettled([
      supabase.from('listening_tests').select('id').limit(1),
      supabase.from('listening_questions').select('id').limit(1), 
      supabase.from('listening_progress').select('id').limit(1)
    ])

    const existingTables: string[] = []
    const tableNames = ['listening_tests', 'listening_questions', 'listening_progress']
    
    tableChecks.forEach((result, index) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        existingTables.push(tableNames[index])
      }
    })

    return NextResponse.json({
      success: true,
      existingTables,
      requiredTables: tableNames,
      isSetupComplete: existingTables.length === 3
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Schema check failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
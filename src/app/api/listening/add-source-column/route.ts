import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Adding source_url column to listening_tests table...')

    // First check if column already exists
    const { data: existingColumn } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'listening_tests')
      .eq('column_name', 'source_url')
      .single()

    if (existingColumn) {
      return NextResponse.json({
        success: true,
        message: 'source_url column already exists'
      })
    }

    // Since we can't use execute_sql, let's try to add the column by creating a new test entry
    // This will fail if the column doesn't exist, then we know we need to manually add it
    try {
      const { error: testError } = await supabase
        .from('listening_tests')
        .insert({
          title: 'TEST_ENTRY_FOR_COLUMN_CHECK',
          source_url: 'test'
        })
        .select()
        .single()

      if (!testError) {
        // If it succeeded, delete the test entry
        await supabase
          .from('listening_tests')
          .delete()
          .eq('title', 'TEST_ENTRY_FOR_COLUMN_CHECK')
        
        return NextResponse.json({
          success: true,
          message: 'source_url column already exists and is working'
        })
      }
    } catch (insertError) {
      // Column doesn't exist, we need to add it manually
    }

    // Since we can't execute DDL directly, we'll need to manually add the column
    // This should be done via Supabase dashboard SQL editor
    return NextResponse.json({
      success: false,
      message: 'source_url column needs to be added manually',
      instructions: `Please run this SQL in your Supabase SQL Editor:
      
ALTER TABLE listening_tests 
ADD COLUMN source_url TEXT;

COMMENT ON COLUMN listening_tests.source_url IS 'URL to the original source (British Council, Cambridge, etc.)';`
    }, { status: 400 })

  } catch (error) {
    console.error('Add source column error:', error)
    return NextResponse.json({
      error: 'Failed to add source column',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET method to check if column exists
export async function GET() {
  try {
    const { data, error } = await supabase.rpc('execute_sql', {
      sql: `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'listening_tests' 
        AND column_name = 'source_url';
      `
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to check column', details: error }, { status: 500 })
    }

    const columnExists = data && data.length > 0

    return NextResponse.json({
      success: true,
      columnExists,
      message: columnExists ? 'source_url column exists' : 'source_url column does not exist'
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check source column',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Adding IPA column to flashcards table...')
    
    // Add IPA column to flashcards table
    const { error } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS ipa TEXT;'
    })

    if (error) {
      console.error('Failed to add IPA column:', error)
      // Try alternative approach
      const { error: error2 } = await supabase
        .from('flashcards')
        .select('ipa')
        .limit(1)

      if (error2) {
        return NextResponse.json({
          success: false,
          message: 'IPA column does not exist and could not be added',
          error: error2.message,
          solution: 'Please manually add: ALTER TABLE flashcards ADD COLUMN ipa TEXT;'
        })
      }
    }

    // Test if IPA column exists by selecting it
    const { data: testData, error: testError } = await supabase
      .from('flashcards')
      .select('ipa')
      .limit(1)

    if (testError) {
      return NextResponse.json({
        success: false,
        message: 'IPA column test failed',
        error: testError.message
      })
    }

    return NextResponse.json({
      success: true,
      message: 'IPA column exists and is ready to use!',
      data: { test_result: testData }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to add IPA column'
      },
      { status: 500 }
    )
  }
}

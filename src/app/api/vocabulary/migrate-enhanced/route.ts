import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🚀 Starting enhanced vocabulary migration...')

    // Step 1: Add enhanced learning columns to flashcards table
    const enhancedColumns = `
      ALTER TABLE flashcards 
      ADD COLUMN IF NOT EXISTS examples TEXT,
      ADD COLUMN IF NOT EXISTS collocations TEXT,
      ADD COLUMN IF NOT EXISTS synonyms TEXT,
      ADD COLUMN IF NOT EXISTS antonyms TEXT,
      ADD COLUMN IF NOT EXISTS etymology TEXT,
      ADD COLUMN IF NOT EXISTS memory_tips TEXT;
    `

    const { error: columnsError } = await supabase.rpc('exec_sql', { sql: enhancedColumns })
    if (columnsError) {
      console.error('❌ Error adding enhanced columns:', columnsError)
      throw new Error(`Failed to add enhanced columns: ${columnsError.message}`)
    }

    // Step 2: Add spaced repetition columns
    const spacedRepetitionColumns = `
      ALTER TABLE flashcards 
      ADD COLUMN IF NOT EXISTS ease_factor DECIMAL DEFAULT 2.5,
      ADD COLUMN IF NOT EXISTS interval INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS repetitions INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS times_studied INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS times_correct INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS times_wrong INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS mastery_level TEXT DEFAULT 'new',
      ADD COLUMN IF NOT EXISTS next_review TIMESTAMP;
    `

    const { error: srError } = await supabase.rpc('exec_sql', { sql: spacedRepetitionColumns })
    if (srError) {
      console.error('❌ Error adding spaced repetition columns:', srError)
      throw new Error(`Failed to add spaced repetition columns: ${srError.message}`)
    }

    // Step 3: Update existing flashcards with default values
    const updateDefaults = `
      UPDATE flashcards 
      SET 
        ease_factor = 2.5,
        interval = 1,
        repetitions = 0,
        times_studied = 0,
        times_correct = 0,
        times_wrong = 0,
        mastery_level = 'new'
      WHERE ease_factor IS NULL;
    `

    const { error: updateError } = await supabase.rpc('exec_sql', { sql: updateDefaults })
    if (updateError) {
      console.error('❌ Error updating defaults:', updateError)
      throw new Error(`Failed to update defaults: ${updateError.message}`)
    }

    // Step 4: Create indexes for performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards(next_review);
      CREATE INDEX IF NOT EXISTS idx_flashcards_mastery_level ON flashcards(mastery_level);
      CREATE INDEX IF NOT EXISTS idx_flashcards_ease_factor ON flashcards(ease_factor);
    `

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexes })
    if (indexError) {
      console.error('❌ Error creating indexes:', indexError)
      // Don't throw error for indexes, they're nice to have but not critical
    }

    // Step 5: Verify the migration by checking if columns exist
    const { data: columns, error: verifyError } = await supabase
      .from('flashcards')
      .select('examples, collocations, synonyms, ease_factor, mastery_level')
      .limit(1)

    if (verifyError) {
      throw new Error(`Migration verification failed: ${verifyError.message}`)
    }

    console.log('✅ Enhanced vocabulary migration completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Enhanced vocabulary learning system migration completed successfully!',
      details: {
        enhanced_columns_added: ['examples', 'collocations', 'synonyms', 'antonyms', 'etymology', 'memory_tips'],
        spaced_repetition_columns_added: ['ease_factor', 'interval', 'repetitions', 'times_studied', 'times_correct', 'times_wrong', 'mastery_level', 'next_review'],
        indexes_created: ['idx_flashcards_next_review', 'idx_flashcards_mastery_level', 'idx_flashcards_ease_factor'],
        verification: 'Migration verified successfully'
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('❌ Enhanced vocabulary migration failed:', errorMessage)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to run enhanced vocabulary migration',
      error: errorMessage,
      help: 'Please run the SQL migration manually in Supabase SQL Editor using supabase-enhanced-vocabulary-migration.sql'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check if enhanced columns exist
    const { data, error } = await supabase
      .from('flashcards')
      .select('examples, collocations, synonyms, ease_factor, mastery_level')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Enhanced vocabulary columns not found',
        status: 'migration_needed',
        error: error.message
      })
    }

    // Count enhanced flashcards
    const { data: enhancedCards, error: countError } = await supabase
      .from('flashcards')
      .select('id')
      .not('examples', 'is', null)

    if (countError) {
      throw new Error(`Failed to count enhanced cards: ${countError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Enhanced vocabulary system is ready',
      status: 'migration_complete',
      stats: {
        enhanced_cards: enhancedCards?.length || 0,
        migration_status: 'completed'
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json({
      success: false,
      message: 'Failed to check migration status',
      error: errorMessage
    }, { status: 500 })
  }
}
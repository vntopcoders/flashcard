import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🔧 Starting user schema migration...')
    
    const results = []
    
    // Step 1: Add user_id column to card_schedule
    try {
      await supabase.rpc('exec', { 
        sql: `ALTER TABLE card_schedule ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) NOT NULL DEFAULT 'vntopcoders@gmail.com';`
      })
      results.push({ step: 1, status: 'success', message: 'Added user_id to card_schedule' })
    } catch (error) {
      // Try alternative approach
      const { error: addError } = await supabase
        .from('card_schedule')
        .select('user_id')
        .limit(1)
      
      if (addError && addError.message.includes('column "user_id" does not exist')) {
        results.push({ step: 1, status: 'needs_manual', message: 'user_id column needs to be added manually' })
      } else {
        results.push({ step: 1, status: 'exists', message: 'user_id column already exists' })
      }
    }
    
    // Step 2: Check current schema
    const { data: columns, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'card_schedule')
      .eq('table_schema', 'public')
    
    if (schemaError) {
      console.error('Schema check error:', schemaError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Schema migration check completed',
      current_schema: {
        card_schedule_columns: columns || []
      },
      migration_results: results,
      instructions: {
        message: "To complete the migration, please run the SQL file manually in Supabase SQL Editor",
        file: "supabase-user-migration.sql",
        steps: [
          "1. Open Supabase Dashboard → SQL Editor",
          "2. Copy and paste the contents of supabase-user-migration.sql",
          "3. Execute the SQL commands",
          "4. Refresh the page to test the fix"
        ]
      }
    })
    
  } catch (error) {
    console.error('💥 Migration check failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Migration check failed'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check if the migration has been applied
    const { data: cardScheduleColumns } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'card_schedule')
      .eq('table_schema', 'public')
    
    const hasUserIdColumn = cardScheduleColumns?.some(col => col.column_name === 'user_id')
    
    // Also check user_reviews table
    const { data: userReviewsColumns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'user_reviews')
      .eq('table_schema', 'public')
    
    const userReviewsHasUserId = userReviewsColumns?.some(col => col.column_name === 'user_id')
    
    return NextResponse.json({
      success: true,
      schema_status: {
        card_schedule_has_user_id: hasUserIdColumn,
        user_reviews_has_user_id: userReviewsHasUserId,
        migration_needed: !hasUserIdColumn,
        tables: {
          card_schedule: cardScheduleColumns?.map(col => ({ name: col.column_name, type: col.data_type })) || [],
          user_reviews: userReviewsColumns?.map(col => col.column_name) || []
        }
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Schema check failed'
      },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Testing spaced repetition tables...')
    
    // Test each table
    const tests = [
      'user_reviews',
      'user_stats', 
      'card_schedule',
      'study_sessions',
      'achievement_progress'
    ]
    
    const results = []
    
    for (const tableName of tests) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1)
        
        if (error) {
          results.push({
            table: tableName,
            status: 'error',
            error: error.message
          })
        } else {
          results.push({
            table: tableName,
            status: 'success',
            count: count || 0,
            has_data: data && data.length > 0
          })
        }
      } catch (err) {
        results.push({
          table: tableName,
          status: 'exception',
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      tables: results,
      summary: {
        total_tables: tests.length,
        success_count: results.filter(r => r.status === 'success').length,
        error_count: results.filter(r => r.status !== 'success').length
      }
    })
    
  } catch (error) {
    console.error('Table test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Table test failed'
      },
      { status: 500 }
    )
  }
}
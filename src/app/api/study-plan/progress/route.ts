import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get study plan progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const week = searchParams.get('week')
    
    if (week) {
      // Get specific week progress
      const { data, error } = await supabase
        .from('study_plan_progress')
        .select('*')
        .eq('week_number', parseInt(week))
        .single()
      
      if (error && error.code !== 'PGRST116') { // Not found is OK
        throw error
      }
      
      return NextResponse.json({
        success: true,
        progress: data || null
      })
    } else {
      // Get all progress
      const { data, error } = await supabase
        .from('study_plan_progress')
        .select('*')
        .order('week_number', { ascending: true })
      
      if (error) throw error
      
      return NextResponse.json({
        success: true,
        progress: data || []
      })
    }
    
  } catch (error) {
    console.error('Failed to get study plan progress:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get progress'
      },
      { status: 500 }
    )
  }
}

// Update study plan progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      week_number, 
      vocabulary_learned,
      grammar_units_completed,
      mock_tests_completed,
      skills_practice_hours,
      daily_tasks_completed,
      is_week_completed,
      notes
    } = body
    
    if (!week_number) {
      return NextResponse.json(
        { success: false, error: 'Week number is required' },
        { status: 400 }
      )
    }
    
    // Upsert progress record
    const { data, error } = await supabase
      .from('study_plan_progress')
      .upsert({
        week_number,
        vocabulary_learned: vocabulary_learned || 0,
        grammar_units_completed: grammar_units_completed || 0,
        mock_tests_completed: mock_tests_completed || 0,
        skills_practice_hours: skills_practice_hours || {},
        daily_tasks_completed: daily_tasks_completed || 0,
        is_week_completed: is_week_completed || false,
        notes: notes || '',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'week_number'
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      message: 'Study plan progress updated',
      progress: data
    })
    
  } catch (error) {
    console.error('Failed to update study plan progress:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update progress'
      },
      { status: 500 }
    )
  }
}
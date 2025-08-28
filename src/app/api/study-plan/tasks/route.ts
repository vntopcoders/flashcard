import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get daily tasks for study plan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const week = searchParams.get('week')
    
    let query = supabase
      .from('study_plan_tasks')
      .select('*')
    
    if (week) {
      query = query.eq('week_number', parseInt(week))
    } else {
      query = query.eq('scheduled_date', date)
    }
    
    const { data, error } = await query.order('scheduled_time', { ascending: true })
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      tasks: data || []
    })
    
  } catch (error) {
    console.error('Failed to get study plan tasks:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get tasks'
      },
      { status: 500 }
    )
  }
}

// Create or update daily task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      week_number,
      day_of_week,
      scheduled_date,
      scheduled_time,
      title,
      description,
      skill_focus,
      duration_minutes,
      resources,
      is_completed
    } = body
    
    const { data, error } = await supabase
      .from('study_plan_tasks')
      .insert({
        week_number,
        day_of_week,
        scheduled_date,
        scheduled_time,
        title,
        description,
        skill_focus,
        duration_minutes,
        resources: resources || [],
        is_completed: is_completed || false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task: data
    })
    
  } catch (error) {
    console.error('Failed to create study plan task:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create task'
      },
      { status: 500 }
    )
  }
}

// Update task completion status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { task_id, is_completed, completion_notes } = body
    
    if (!task_id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('study_plan_tasks')
      .update({
        is_completed: is_completed,
        completion_notes: completion_notes || '',
        completed_at: is_completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', task_id)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      task: data
    })
    
  } catch (error) {
    console.error('Failed to update study plan task:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update task'
      },
      { status: 500 }
    )
  }
}
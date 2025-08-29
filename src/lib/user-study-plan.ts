/**
 * USER STUDY PLAN SERVICE
 * 
 * Manages user-specific study plans, daily lessons, and progress tracking
 * Based on the 24-week IELTS preparation structure
 */

import { supabase } from './supabase'

export interface StudyPlanTemplate {
  id: string
  name: string
  description?: string
  total_weeks: number
  target_level: string
  created_at: string
  updated_at: string
}

export interface WeeklyPlanTemplate {
  id: string
  study_plan_template_id: string
  week_number: number
  title: string
  target_band?: string
  vocabulary_goal: number
  grammar_units?: string
  focus_skills: string[]
  milestones: string[]
  daily_hours: number
  phase?: string
  created_at: string
  updated_at: string
}

export interface DailyTaskTemplate {
  id: string
  weekly_plan_template_id: string
  day_of_week: number
  time_slot?: string
  duration_minutes: number
  title: string
  description?: string
  skill: 'vocabulary' | 'grammar' | 'reading' | 'writing' | 'listening' | 'speaking'
  resources: string[]
  order_index: number
  is_required: boolean
  created_at: string
  updated_at: string
}

export interface UserStudyPlan {
  id: string
  user_id: string
  study_plan_template_id: string
  start_date: string
  target_completion_date?: string
  current_week: number
  current_day: number
  target_score: number
  current_score?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserWeeklyProgress {
  id: string
  user_study_plan_id: string
  week_number: number
  vocabulary_learned: number
  vocabulary_goal: number
  grammar_completed: number
  tasks_completed: number
  total_tasks: number
  total_study_minutes: number
  is_completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface UserDailyTask {
  id: string
  user_study_plan_id: string
  daily_task_template_id?: string
  scheduled_date: string
  week_number: number
  day_of_week: number
  time_slot?: string
  duration_minutes: number
  title: string
  description?: string
  skill: 'vocabulary' | 'grammar' | 'reading' | 'writing' | 'listening' | 'speaking'
  resources: string[]
  is_completed: boolean
  completed_at?: string
  actual_duration_minutes?: number
  notes?: string
  difficulty_rating?: number
  created_at: string
  updated_at: string
}

export interface GrammarLesson {
  id: string
  unit_number: number
  title: string
  description?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  grammar_points: string[]
  examples: Array<{ sentence: string; explanation: string }>
  exercises: Array<{ question: string; answer: string; explanation?: string }>
  order_index: number
  created_at: string
  updated_at: string
}

export interface UserGrammarProgress {
  id: string
  user_id: string
  grammar_lesson_id: string
  is_completed: boolean
  completion_percentage: number
  exercises_completed: number
  total_exercises: number
  score?: number
  time_spent_minutes: number
  completed_at?: string
  last_reviewed_at?: string
  created_at: string
  updated_at: string
}

export class UserStudyPlanService {

  /**
   * Initialize a new study plan for a user
   */
  static async initializeUserStudyPlan(
    userId: string, 
    templateId: string = 'ielts-24-week',
    targetScore: number = 7.0,
    startDate?: Date
  ): Promise<UserStudyPlan> {
    const start = startDate || new Date()
    const targetCompletion = new Date(start)
    targetCompletion.setDate(targetCompletion.getDate() + (24 * 7)) // 24 weeks

    const { data, error } = await supabase
      .from('user_study_plans')
      .insert({
        user_id: userId,
        study_plan_template_id: templateId,
        start_date: start.toISOString().split('T')[0],
        target_completion_date: targetCompletion.toISOString().split('T')[0],
        target_score: targetScore,
        current_week: 1,
        current_day: 1,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to initialize study plan: ${error.message}`)
    }

    // Generate daily tasks for the first week
    await this.generateDailyTasksForWeek(data.id, 1)

    return data
  }

  /**
   * Get user's active study plan
   */
  static async getUserStudyPlan(userId: string): Promise<UserStudyPlan | null> {
    const { data, error } = await supabase
      .from('user_study_plans')
      .select(`
        *,
        template:study_plan_templates(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get study plan: ${error.message}`)
    }

    return data
  }

  /**
   * Get today's tasks for a user
   */
  static async getTodaysTasks(userId: string): Promise<UserDailyTask[]> {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: studyPlan } = await supabase
      .from('user_study_plans')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (!studyPlan) {
      return []
    }

    const { data, error } = await supabase
      .from('user_daily_tasks')
      .select('*')
      .eq('user_study_plan_id', studyPlan.id)
      .eq('scheduled_date', today)
      .order('time_slot', { ascending: true })

    if (error) {
      throw new Error(`Failed to get today's tasks: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get tasks for a specific week
   */
  static async getWeeklyTasks(userId: string, weekNumber: number): Promise<UserDailyTask[]> {
    const { data: studyPlan } = await supabase
      .from('user_study_plans')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (!studyPlan) {
      return []
    }

    const { data, error } = await supabase
      .from('user_daily_tasks')
      .select('*')
      .eq('user_study_plan_id', studyPlan.id)
      .eq('week_number', weekNumber)
      .order('day_of_week', { ascending: true })
      .order('time_slot', { ascending: true })

    if (error) {
      throw new Error(`Failed to get weekly tasks: ${error.message}`)
    }

    return data || []
  }

  /**
   * Complete a daily task
   */
  static async completeTask(
    userId: string, 
    taskId: string, 
    actualDurationMinutes?: number,
    notes?: string,
    difficultyRating?: number
  ): Promise<UserDailyTask> {
    // Verify the task belongs to the user
    const { data: task } = await supabase
      .from('user_daily_tasks')
      .select(`
        *,
        study_plan:user_study_plans!inner(user_id)
      `)
      .eq('id', taskId)
      .eq('study_plan.user_id', userId)
      .single()

    if (!task) {
      throw new Error('Task not found or access denied')
    }

    const { data, error } = await supabase
      .from('user_daily_tasks')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        actual_duration_minutes: actualDurationMinutes,
        notes,
        difficulty_rating: difficultyRating
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to complete task: ${error.message}`)
    }

    // Update weekly progress
    await this.updateWeeklyProgress(task.user_study_plan_id, task.week_number)

    return data
  }

  /**
   * Get user's weekly progress
   */
  static async getWeeklyProgress(userId: string, weekNumber?: number): Promise<UserWeeklyProgress[]> {
    const { data: studyPlan } = await supabase
      .from('user_study_plans')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (!studyPlan) {
      return []
    }

    let query = supabase
      .from('user_weekly_progress')
      .select('*')
      .eq('user_study_plan_id', studyPlan.id)

    if (weekNumber) {
      query = query.eq('week_number', weekNumber)
    }

    const { data, error } = await query.order('week_number', { ascending: true })

    if (error) {
      throw new Error(`Failed to get weekly progress: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get overall study plan progress
   */
  static async getOverallProgress(userId: string) {
    const { data: studyPlan } = await supabase
      .from('user_study_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (!studyPlan) {
      return null
    }

    // Get weekly progress summary
    const { data: weeklyProgress } = await supabase
      .from('user_weekly_progress')
      .select('*')
      .eq('user_study_plan_id', studyPlan.id)

    // Calculate totals
    const totalVocabularyLearned = weeklyProgress?.reduce((sum, week) => sum + week.vocabulary_learned, 0) || 0
    const totalGrammarCompleted = weeklyProgress?.reduce((sum, week) => sum + week.grammar_completed, 0) || 0
    const totalTasksCompleted = weeklyProgress?.reduce((sum, week) => sum + week.tasks_completed, 0) || 0
    const totalStudyMinutes = weeklyProgress?.reduce((sum, week) => sum + week.total_study_minutes, 0) || 0
    const weeksCompleted = weeklyProgress?.filter(week => week.is_completed).length || 0

    // Calculate current streak
    const today = new Date()
    const startDate = new Date(studyPlan.start_date)
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      studyPlan,
      weeklyProgress: weeklyProgress || [],
      totalVocabularyLearned,
      totalGrammarCompleted,
      totalTasksCompleted,
      totalStudyMinutes,
      weeksCompleted,
      daysSinceStart,
      currentWeek: studyPlan.current_week,
      currentDay: studyPlan.current_day
    }
  }

  /**
   * Generate daily tasks for a specific week
   */
  static async generateDailyTasksForWeek(studyPlanId: string, weekNumber: number) {
    // This would typically fetch from templates and create user-specific instances
    // For now, we'll use the mock data structure from the component
    const mockTasks = [
      {
        day_of_week: 1,
        time_slot: '7:00-7:30',
        duration_minutes: 30,
        title: 'Vocabulary Review',
        description: 'Anki flashcards + 40 new words from Academic Word List',
        skill: 'vocabulary',
        resources: ['Anki Desktop', 'AWL Vocabulary List']
      },
      {
        day_of_week: 1,
        time_slot: '8:00-9:00',
        duration_minutes: 60,
        title: 'Reading Practice',
        description: 'Cambridge IELTS 16 - Test 2, Passage 1 (Skimming & Scanning)',
        skill: 'reading',
        resources: ['Cambridge IELTS 16', 'Timer']
      },
      {
        day_of_week: 1,
        time_slot: '14:00-14:45',
        duration_minutes: 45,
        title: 'Grammar Focus',
        description: 'Grammar in Use: Units 26-27 (Present Perfect vs Past Simple)',
        skill: 'grammar',
        resources: ['Grammar in Use Book', 'Exercise notebook']
      }
      // Add more tasks for other days
    ]

    const studyPlan = await supabase
      .from('user_study_plans')
      .select('start_date')
      .eq('id', studyPlanId)
      .single()

    if (!studyPlan || !studyPlan.data) return

    const startDate = new Date(studyPlan.data.start_date)
    const weekStartDate = new Date(startDate)
    weekStartDate.setDate(startDate.getDate() + (weekNumber - 1) * 7)

    const tasksToInsert = mockTasks.map(task => {
      const taskDate = new Date(weekStartDate)
      taskDate.setDate(weekStartDate.getDate() + task.day_of_week - 1)

      return {
        user_study_plan_id: studyPlanId,
        scheduled_date: taskDate.toISOString().split('T')[0],
        week_number: weekNumber,
        day_of_week: task.day_of_week,
        time_slot: task.time_slot,
        duration_minutes: task.duration_minutes,
        title: task.title,
        description: task.description,
        skill: task.skill,
        resources: task.resources
      }
    })

    const { error } = await supabase
      .from('user_daily_tasks')
      .insert(tasksToInsert)

    if (error) {
      console.error('Failed to generate daily tasks:', error)
    }
  }

  /**
   * Update weekly progress based on completed tasks
   */
  static async updateWeeklyProgress(studyPlanId: string, weekNumber: number) {
    // Get all tasks for this week
    const { data: tasks } = await supabase
      .from('user_daily_tasks')
      .select('*')
      .eq('user_study_plan_id', studyPlanId)
      .eq('week_number', weekNumber)

    if (!tasks) return

    const completedTasks = tasks.filter(task => task.is_completed)
    const totalStudyMinutes = completedTasks.reduce((sum, task) => sum + (task.actual_duration_minutes || task.duration_minutes), 0)
    const vocabularyTasksCompleted = completedTasks.filter(task => task.skill === 'vocabulary').length
    const grammarTasksCompleted = completedTasks.filter(task => task.skill === 'grammar').length

    // Upsert weekly progress
    const { error } = await supabase
      .from('user_weekly_progress')
      .upsert({
        user_study_plan_id: studyPlanId,
        week_number: weekNumber,
        tasks_completed: completedTasks.length,
        total_tasks: tasks.length,
        total_study_minutes: totalStudyMinutes,
        vocabulary_learned: vocabularyTasksCompleted * 40, // Rough estimate
        grammar_completed: grammarTasksCompleted,
        is_completed: completedTasks.length === tasks.length
      }, {
        onConflict: 'user_study_plan_id,week_number'
      })

    if (error) {
      console.error('Failed to update weekly progress:', error)
    }
  }

  /**
   * Get grammar lessons for a user's level
   */
  static async getGrammarLessons(level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<GrammarLesson[]> {
    const { data, error } = await supabase
      .from('grammar_lessons')
      .select('*')
      .eq('level', level)
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to get grammar lessons: ${error.message}`)
    }

    return data || []
  }

  /**
   * Update user's grammar progress
   */
  static async updateGrammarProgress(
    userId: string,
    lessonId: string,
    progress: {
      completion_percentage?: number
      exercises_completed?: number
      score?: number
      time_spent_minutes?: number
    }
  ): Promise<UserGrammarProgress> {
    const updateData = {
      ...progress,
      is_completed: progress.completion_percentage === 100,
      last_reviewed_at: new Date().toISOString(),
      ...(progress.completion_percentage === 100 && {
        completed_at: new Date().toISOString()
      })
    }

    const { data, error } = await supabase
      .from('user_grammar_progress')
      .upsert({
        user_id: userId,
        grammar_lesson_id: lessonId,
        ...updateData
      }, {
        onConflict: 'user_id,grammar_lesson_id'
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update grammar progress: ${error.message}`)
    }

    return data
  }

  /**
   * Get user's grammar progress
   */
  static async getUserGrammarProgress(userId: string): Promise<UserGrammarProgress[]> {
    const { data, error } = await supabase
      .from('user_grammar_progress')
      .select(`
        *,
        lesson:grammar_lessons(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to get grammar progress: ${error.message}`)
    }

    return data || []
  }
}
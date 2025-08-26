import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Lesson {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface Flashcard {
  id: string
  english: string
  vietnamese: string
  difficulty: number
  category: string
  lesson_id: string | null
  created_at: string
  updated_at: string
}

export interface FlashcardWithLesson extends Flashcard {
  lesson?: Lesson
}

// Lesson operations
export const lessonDb = {
  // Get all lessons
  async getAll() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data as Lesson[]
  },

  // Get lesson by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Lesson
  },

  // Create new lesson
  async create(lesson: {
    name: string
    description?: string
    color?: string
  }) {
    const { data, error } = await supabase
      .from('lessons')
      .insert([lesson])
      .select()
      .single()
    
    if (error) throw error
    return data as Lesson
  },

  // Update lesson
  async update(id: string, updates: {
    name?: string
    description?: string
    color?: string
  }) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Lesson
  },

  // Delete lesson
  async delete(id: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { success: true }
  },

  // Get flashcards count for a lesson
  async getFlashcardCount(id: string) {
    const { count, error } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('lesson_id', id)
    
    if (error) throw error
    return count || 0
  },

  // Delete all flashcards in a lesson
  async deleteAllFlashcards(id: string) {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('lesson_id', id)
    
    if (error) throw error
    return { success: true }
  }
}

// Database operations
export const flashcardDb = {
  // Get all flashcards with lesson info
  async getAll() {
    const { data, error } = await supabase
      .from('flashcards')
      .select(`
        *,
        lesson:lessons(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as FlashcardWithLesson[]
  },

  // Get flashcards by lesson ID
  async getByLessonId(lessonId: string) {
    const { data, error } = await supabase
      .from('flashcards')
      .select(`
        *,
        lesson:lessons(*)
      `)
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as FlashcardWithLesson[]
  },

  // Get flashcard by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('flashcards')
      .select(`
        *,
        lesson:lessons(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as FlashcardWithLesson
  },

  // Create new flashcard
  async create(flashcard: {
    english: string
    vietnamese: string
    category: string
    difficulty: number
    lesson_id?: string
  }) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([flashcard])
      .select(`
        *,
        lesson:lessons(*)
      `)
      .single()
    
    if (error) throw error
    return data as FlashcardWithLesson
  },

  // Update flashcard
  async update(id: string, updates: {
    english?: string
    vietnamese?: string
    category?: string
    difficulty?: number
    lesson_id?: string
  }) {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        lesson:lessons(*)
      `)
      .single()
    
    if (error) throw error
    return data as FlashcardWithLesson
  },

  // Delete flashcard
  async delete(id: string) {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { success: true }
  },

  // Count flashcards
  async count() {
    const { count, error } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Flashcard {
  id: string
  english: string
  vietnamese: string
  difficulty: number
  category: string
  created_at: string
  updated_at: string
}

// Database operations
export const flashcardDb = {
  // Get all flashcards
  async getAll() {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Flashcard[]
  },

  // Get flashcard by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Flashcard
  },

  // Create new flashcard
  async create(flashcard: {
    english: string
    vietnamese: string
    category: string
    difficulty: number
  }) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([flashcard])
      .select()
      .single()
    
    if (error) throw error
    return data as Flashcard
  },

  // Update flashcard
  async update(id: string, updates: {
    english?: string
    vietnamese?: string
    category?: string
    difficulty?: number
  }) {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Flashcard
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

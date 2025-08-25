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

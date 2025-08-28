export interface Lesson {
  id: string
  name: string
  description: string | null
  color: string
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  english: string
  vietnamese: string
  ipa?: string | null
  difficulty: number
  category: string
  lessonId: string | null
  createdAt: string
  updatedAt: string
}

export interface FlashcardWithLesson extends Flashcard {
  lesson?: Lesson
}

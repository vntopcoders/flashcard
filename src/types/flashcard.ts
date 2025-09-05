export interface Lesson {
  id: string
  name: string
  description: string | null
  color: string
  createdAt: string
  updatedAt: string
}

export interface ExampleSentence {
  sentence: string
  translation: string
  context?: string
}

export interface Collocation {
  phrase: string
  meaning: string
  example: string
}

export interface Flashcard {
  id: string
  english: string
  vietnamese: string
  ipa?: string | null
  difficulty: number
  category: string
  
  // Enhanced learning features
  examples?: ExampleSentence[] | null
  collocations?: Collocation[] | null
  synonyms?: string[] | null
  antonyms?: string[] | null
  etymology?: string | null
  memory_tips?: string | null
  
  // Spaced repetition data
  ease_factor: number
  interval: number
  repetitions: number
  last_reviewed?: string | null
  next_review?: string | null
  
  // Learning statistics
  times_studied: number
  times_correct: number
  times_wrong: number
  mastery_level: 'new' | 'learning' | 'familiar' | 'mastered'
  
  lessonId: string | null
  createdAt: string
  updatedAt: string
}

export interface FlashcardWithLesson extends Flashcard {
  lesson?: Lesson
}

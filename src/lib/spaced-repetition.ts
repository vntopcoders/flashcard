/**
 * SPACED REPETITION SYSTEM (SM-2 Algorithm)
 * 
 * Based on SuperMemo SM-2 algorithm by Piotr Wozniak
 * Optimized for IELTS vocabulary learning
 * 
 * Quality ratings (0-5):
 * 0: Complete blackout, no recall
 * 1: Incorrect response with correct answer being familiar  
 * 2: Incorrect response with correct answer seeming easy to remember
 * 3: Correct response recalled with serious difficulty
 * 4: Correct response after hesitation
 * 5: Perfect response, immediate recall
 */

import { supabase } from './supabase'

export interface ReviewResult {
  flashcard_id: string
  quality: number // 0-5 rating
  response_time_ms: number
  reviewed_at: Date
}

export interface CardSchedule {
  id: string
  flashcard_id: string
  next_review_date: Date
  current_interval_days: number
  current_easiness_factor: number
  current_repetition_number: number
  card_state: 'new' | 'learning' | 'review' | 'relearning' | 'suspended' | 'mastered'
  consecutive_correct: number
  total_reviews: number
  total_lapses: number
  average_quality: number
}

export interface StudySession {
  id: string
  session_start: Date
  session_end?: Date
  total_duration_ms?: number
  cards_studied: number
  new_cards: number
  review_cards: number
  correct_answers: number
  incorrect_answers: number
  session_type: 'new_cards' | 'reviews' | 'mixed' | 'cram' | 'test'
  lesson_focus?: string
  accuracy_rate?: number
  average_response_time_ms?: number
}

export interface DailyStats {
  date: Date
  cards_reviewed: number
  cards_learned: number
  cards_relearned: number
  cards_correct: number
  cards_incorrect: number
  total_study_time_ms: number
  accuracy_rate: number
  daily_streak: number
  longest_streak: number
}

export class SpacedRepetitionService {
  
  /**
   * Calculate SM-2 algorithm parameters for next review
   */
  static calculateSM2(
    quality: number,
    currentEF: number,
    currentInterval: number,
    repetitionNumber: number
  ) {
    // Calculate new Easiness Factor using SM-2 formula
    let newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    // EF should be at least 1.3
    if (newEF < 1.3) {
      newEF = 1.3
    }
    
    let newInterval: number
    let newRepetition: number
    
    // If quality < 3, the card was recalled incorrectly (failed)
    if (quality < 3) {
      newRepetition = 0
      newInterval = 1
    } else {
      newRepetition = repetitionNumber + 1
      
      // Calculate new interval based on SM-2 algorithm
      if (newRepetition === 1) {
        newInterval = 1
      } else if (newRepetition === 2) {
        newInterval = 6
      } else {
        newInterval = Math.ceil(currentInterval * newEF)
      }
    }
    
    // Calculate next review date
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)
    
    return {
      newEF,
      newInterval,
      newRepetition,
      nextReviewDate
    }
  }

  /**
   * Get cards due for review today
   */
  static async getCardsDueForReview(limit: number = 50): Promise<CardSchedule[]> {
    const { data, error } = await supabase
      .from('card_schedule')
      .select(`
        *,
        flashcard:flashcards (
          id,
          english,
          vietnamese,
          ipa,
          difficulty,
          category,
          lesson:lessons (
            id,
            name,
            color
          )
        )
      `)
      .lte('next_review_date', new Date().toISOString())
      .not('card_state', 'in', '(suspended,mastered)')
      .order('next_review_date', { ascending: true })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get cards due for review: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get new cards for learning
   */
  static async getNewCards(limit: number = 20): Promise<CardSchedule[]> {
    const { data, error } = await supabase
      .from('card_schedule')
      .select(`
        *,
        flashcard:flashcards (
          id,
          english,
          vietnamese,
          ipa,
          difficulty,
          category,
          lesson:lessons (
            id,
            name,
            color
          )
        )
      `)
      .eq('card_state', 'new')
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get new cards: ${error.message}`)
    }

    return data || []
  }

  /**
   * Process a review result and update card schedule
   */
  static async processReview(reviewResult: ReviewResult): Promise<CardSchedule> {
    // Insert review record
    const { error: reviewError } = await supabase
      .from('user_reviews')
      .insert({
        flashcard_id: reviewResult.flashcard_id,
        quality: reviewResult.quality,
        response_time_ms: reviewResult.response_time_ms,
        reviewed_at: reviewResult.reviewed_at.toISOString()
      })

    if (reviewError) {
      throw new Error(`Failed to record review: ${reviewError.message}`)
    }

    // Get current schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from('card_schedule')
      .select('*')
      .eq('flashcard_id', reviewResult.flashcard_id)
      .single()

    if (scheduleError) {
      throw new Error(`Failed to get card schedule: ${scheduleError.message}`)
    }

    // Calculate new SM-2 values
    const sm2Result = this.calculateSM2(
      reviewResult.quality,
      schedule.current_easiness_factor,
      schedule.current_interval_days,
      schedule.current_repetition_number
    )

    // Determine new card state
    let newCardState: string
    if (reviewResult.quality < 3) {
      newCardState = 'relearning'
    } else if (sm2Result.newRepetition < 4) {
      newCardState = 'learning'
    } else if (sm2Result.newEF > 2.8 && sm2Result.newInterval > 30) {
      newCardState = 'mastered'
    } else {
      newCardState = 'review'
    }

    // Update card schedule
    const { data: updatedSchedule, error: updateError } = await supabase
      .from('card_schedule')
      .update({
        next_review_date: sm2Result.nextReviewDate.toISOString(),
        current_interval_days: sm2Result.newInterval,
        current_easiness_factor: sm2Result.newEF,
        current_repetition_number: sm2Result.newRepetition,
        last_reviewed_at: reviewResult.reviewed_at.toISOString(),
        total_reviews: schedule.total_reviews + 1,
        consecutive_correct: reviewResult.quality >= 3 
          ? schedule.consecutive_correct + 1 
          : 0,
        total_lapses: reviewResult.quality < 3 
          ? schedule.total_lapses + 1 
          : schedule.total_lapses,
        card_state: newCardState,
        average_quality: (
          (schedule.average_quality * schedule.total_reviews + reviewResult.quality) / 
          (schedule.total_reviews + 1)
        ),
        updated_at: new Date().toISOString()
      })
      .eq('flashcard_id', reviewResult.flashcard_id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update card schedule: ${updateError.message}`)
    }

    return updatedSchedule
  }

  /**
   * Start a new study session
   */
  static async startStudySession(
    sessionType: 'new_cards' | 'reviews' | 'mixed' | 'cram' | 'test' = 'mixed',
    lessonFocus?: string
  ): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        session_start: new Date().toISOString(),
        session_type: sessionType,
        lesson_focus: lessonFocus
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to start study session: ${error.message}`)
    }

    return data
  }

  /**
   * End a study session and calculate stats
   */
  static async endStudySession(
    sessionId: string,
    results: {
      cards_studied: number
      new_cards: number
      review_cards: number
      correct_answers: number
      incorrect_answers: number
    }
  ): Promise<StudySession> {
    const sessionEnd = new Date()
    const accuracyRate = results.cards_studied > 0 
      ? (results.correct_answers / results.cards_studied * 100) 
      : 0

    const { data, error } = await supabase
      .from('study_sessions')
      .update({
        session_end: sessionEnd.toISOString(),
        cards_studied: results.cards_studied,
        new_cards: results.new_cards,
        review_cards: results.review_cards,
        correct_answers: results.correct_answers,
        incorrect_answers: results.incorrect_answers,
        accuracy_rate: accuracyRate
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to end study session: ${error.message}`)
    }

    return data
  }

  /**
   * Get daily statistics
   */
  static async getDailyStats(date?: Date): Promise<DailyStats | null> {
    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('date', dateStr)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw new Error(`Failed to get daily stats: ${error.message}`)
    }

    return data
  }

  /**
   * Get learning progress overview
   */
  static async getLearningProgress() {
    // Get card distribution by state
    const { data: cardStates, error: statesError } = await supabase
      .from('card_schedule')
      .select('card_state')

    if (statesError) {
      throw new Error(`Failed to get card states: ${statesError.message}`)
    }

    // Count card states manually
    const stateCounts = (cardStates || []).reduce((acc: Record<string, number>, card: { card_state: string }) => {
      acc[card.card_state] = (acc[card.card_state] || 0) + 1
      return acc
    }, {})

    // Get cards due today count
    const { data: dueCards, error: dueError } = await supabase
      .from('card_schedule')
      .select('id')
      .lte('next_review_date', new Date().toISOString())
      .not('card_state', 'in', '(suspended,mastered)')

    if (dueError) {
      throw new Error(`Failed to get due cards: ${dueError.message}`)
    }

    // Get recent study stats
    const { data: recentStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(7)

    if (statsError) {
      throw new Error(`Failed to get recent stats: ${statsError.message}`)
    }

    // Convert to the expected format
    const formattedCardStates = Object.entries(stateCounts).map(([state, count]) => ({
      state,
      count
    }))

    return {
      cardStates: formattedCardStates,
      dueToday: dueCards?.length || 0,
      recentStats: recentStats || []
    }
  }

  /**
   * Get achievements progress
   */
  static async getAchievements() {
    const { data, error } = await supabase
      .from('achievement_progress')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to get achievements: ${error.message}`)
    }

    return data || []
  }

  /**
   * Update achievement progress
   */
  static async updateAchievementProgress(
    achievementType: string, 
    progress: number
  ) {
    // For now, use a simple completion threshold since we can't compare with query
    // In production, you'd need to fetch the target first
    const isCompleted = progress >= 100 // Simple threshold for mock implementation

    const { error } = await supabase
      .from('achievement_progress')
      .update({
        current_progress: progress,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('achievement_type', achievementType)

    if (error) {
      throw new Error(`Failed to update achievement: ${error.message}`)
    }
  }

  /**
   * Get optimal study schedule for user
   */
  static async getStudySchedule() {
    // const now = new Date() // Not currently used
    // const today = now.toISOString().split('T')[0] // Commented out as not used
    
    // Get cards due today
    const dueTodayPromise = this.getCardsDueForReview(50)
    
    // Get new cards to learn
    const newCardsPromise = this.getNewCards(20)
    
    // Get today's stats
    const dailyStatsPromise = this.getDailyStats()

    const [dueToday, newCards, dailyStats] = await Promise.all([
      dueTodayPromise,
      newCardsPromise,
      dailyStatsPromise
    ])

    return {
      dueToday: dueToday.length,
      newAvailable: newCards.length,
      reviewsCompleted: dailyStats?.cards_reviewed || 0,
      accuracy: dailyStats?.accuracy_rate || 0,
      streak: dailyStats?.daily_streak || 0,
      recommendedSession: this.getRecommendedSession(dueToday.length, newCards.length, dailyStats)
    }
  }

  /**
   * Get recommended study session based on current state
   */
  private static getRecommendedSession(
    dueCount: number, 
    newCount: number, 
    stats?: DailyStats | null
  ) {
    const reviewsToday = stats?.cards_reviewed || 0
    
    // If user hasn't studied today and has many due cards, focus on reviews
    if (reviewsToday === 0 && dueCount > 20) {
      return {
        type: 'reviews',
        cardCount: Math.min(30, dueCount),
        reason: 'You have many cards due for review. Let\'s catch up!'
      }
    }
    
    // If user has done some reviews but has new cards, mix them
    if (reviewsToday > 0 && reviewsToday < 20 && newCount > 0) {
      return {
        type: 'mixed',
        cardCount: 20,
        reason: 'Perfect time to learn new words and review old ones!'
      }
    }
    
    // If user has done many reviews, focus on new cards
    if (reviewsToday >= 20 && newCount > 10) {
      return {
        type: 'new_cards',
        cardCount: 15,
        reason: 'Great progress today! Ready to learn some new vocabulary?'
      }
    }
    
    // Default mixed session
    return {
      type: 'mixed',
      cardCount: 25,
      reason: 'A balanced session of new and review cards'
    }
  }
}

// Helper functions for frontend components
export const formatNextReview = (nextReviewDate: Date): string => {
  const now = new Date()
  const diffMs = nextReviewDate.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMs < 0) {
    return 'Due now'
  } else if (diffHours < 24) {
    return `Due in ${diffHours}h`
  } else if (diffDays < 7) {
    return `Due in ${diffDays}d`
  } else {
    return `Due ${nextReviewDate.toLocaleDateString()}`
  }
}

export const getCardStateColor = (state: string): string => {
  switch (state) {
    case 'new': return 'bg-blue-100 text-blue-800'
    case 'learning': return 'bg-yellow-100 text-yellow-800'
    case 'review': return 'bg-green-100 text-green-800'
    case 'relearning': return 'bg-orange-100 text-orange-800'
    case 'mastered': return 'bg-purple-100 text-purple-800'
    case 'suspended': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
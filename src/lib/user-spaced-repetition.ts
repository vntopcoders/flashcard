/**
 * USER-SPECIFIC SPACED REPETITION SYSTEM
 * 
 * Enhanced version of the SM-2 algorithm with user isolation
 * Each user maintains their own progress and schedule
 */

import { supabase } from './supabase'
import { ReviewResult, CardSchedule, StudySession, DailyStats } from './spaced-repetition'

export class UserSpacedRepetitionService {
  
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
   * Get cards due for review today for a specific user
   */
  static async getCardsDueForReview(userId: string, limit: number = 50): Promise<CardSchedule[]> {
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
      .eq('user_id', userId)
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
   * Get new cards for learning for a specific user
   */
  static async getNewCards(userId: string, limit: number = 20): Promise<CardSchedule[]> {
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
      .eq('user_id', userId)
      .eq('card_state', 'new')
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get new cards: ${error.message}`)
    }

    return data || []
  }

  /**
   * Process a review result and update card schedule for a specific user
   */
  static async processReview(userId: string, reviewResult: ReviewResult): Promise<CardSchedule> {
    // Insert review record with user_id
    const { error: reviewError } = await supabase
      .from('user_reviews')
      .insert({
        user_id: userId,
        flashcard_id: reviewResult.flashcard_id,
        quality: reviewResult.quality,
        response_time_ms: reviewResult.response_time_ms,
        reviewed_at: reviewResult.reviewed_at.toISOString()
      })

    if (reviewError) {
      throw new Error(`Failed to record review: ${reviewError.message}`)
    }

    // Get current schedule for this user
    const { data: schedule, error: scheduleError } = await supabase
      .from('card_schedule')
      .select('*')
      .eq('user_id', userId)
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

    // Update card schedule for this user
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
      .eq('user_id', userId)
      .eq('flashcard_id', reviewResult.flashcard_id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update card schedule: ${updateError.message}`)
    }

    // Update user study statistics
    await this.updateUserStats(userId, reviewResult)

    return updatedSchedule
  }

  /**
   * Start a new study session for a specific user
   */
  static async startStudySession(
    userId: string,
    sessionType: 'new_cards' | 'reviews' | 'mixed' | 'cram' | 'test' = 'mixed',
    lessonFocus?: string
  ): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
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
   * End a study session and calculate stats for a specific user
   */
  static async endStudySession(
    userId: string,
    sessionId: string,
    results: {
      cards_studied: number
      new_cards: number
      review_cards: number
      correct_answers: number
      incorrect_answers: number
      average_response_time_ms?: number
    }
  ): Promise<StudySession> {
    const sessionEnd = new Date()
    const accuracyRate = results.cards_studied > 0 
      ? (results.correct_answers / results.cards_studied * 100) 
      : 0

    // Get session start time to calculate duration
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('session_start')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single()

    if (sessionError) {
      throw new Error(`Failed to get session: ${sessionError.message}`)
    }

    const sessionStart = new Date(session.session_start)
    const totalDurationMs = sessionEnd.getTime() - sessionStart.getTime()

    const { data: updatedSession, error } = await supabase
      .from('study_sessions')
      .update({
        session_end: sessionEnd.toISOString(),
        total_duration_ms: totalDurationMs,
        cards_studied: results.cards_studied,
        new_cards: results.new_cards,
        review_cards: results.review_cards,
        correct_answers: results.correct_answers,
        incorrect_answers: results.incorrect_answers,
        accuracy_rate: accuracyRate,
        average_response_time_ms: results.average_response_time_ms
      })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to end study session: ${error.message}`)
    }

    // Update daily stats
    await this.updateDailyStats(userId, results, totalDurationMs, accuracyRate)

    return updatedSession
  }

  /**
   * Get daily statistics for a specific user
   */
  static async getDailyStats(userId: string, date?: Date): Promise<DailyStats | null> {
    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw new Error(`Failed to get daily stats: ${error.message}`)
    }

    return data
  }

  /**
   * Get learning progress overview for a specific user
   */
  static async getLearningProgress(userId: string) {
    // Get card distribution by state for this user
    const { data: cardStates, error: statesError } = await supabase
      .from('card_schedule')
      .select('card_state')
      .eq('user_id', userId)

    if (statesError) {
      throw new Error(`Failed to get card states: ${statesError.message}`)
    }

    // Count card states manually
    const stateCounts = (cardStates || []).reduce((acc: Record<string, number>, card: { card_state: string }) => {
      acc[card.card_state] = (acc[card.card_state] || 0) + 1
      return acc
    }, {})

    // Get cards due today count for this user
    const { data: dueCards, error: dueError } = await supabase
      .from('card_schedule')
      .select('id')
      .eq('user_id', userId)
      .lte('next_review_date', new Date().toISOString())
      .not('card_state', 'in', '(suspended,mastered)')

    if (dueError) {
      throw new Error(`Failed to get due cards: ${dueError.message}`)
    }

    // Get recent study stats for this user
    const { data: recentStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
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
   * Get achievements progress for a specific user
   */
  static async getAchievements(userId: string) {
    const { data, error } = await supabase
      .from('achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to get achievements: ${error.message}`)
    }

    return data || []
  }

  /**
   * Update achievement progress for a specific user
   */
  static async updateAchievementProgress(
    userId: string,
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
      .eq('user_id', userId)
      .eq('achievement_type', achievementType)

    if (error) {
      throw new Error(`Failed to update achievement: ${error.message}`)
    }
  }

  /**
   * Get optimal study schedule for a specific user
   */
  static async getStudySchedule(userId: string) {
    const now = new Date()
    
    // Get cards due today for this user
    const dueTodayPromise = this.getCardsDueForReview(userId, 50)
    
    // Get new cards to learn for this user
    const newCardsPromise = this.getNewCards(userId, 20)
    
    // Get today's stats for this user
    const dailyStatsPromise = this.getDailyStats(userId)

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

  /**
   * Update user statistics after a review
   */
  private static async updateUserStats(userId: string, reviewResult: ReviewResult) {
    const today = new Date().toISOString().split('T')[0]

    // Get or create today's stats
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (existingStats) {
      // Update existing stats
      await supabase
        .from('user_stats')
        .update({
          cards_reviewed: existingStats.cards_reviewed + 1,
          cards_correct: reviewResult.quality >= 3 ? existingStats.cards_correct + 1 : existingStats.cards_correct,
          cards_incorrect: reviewResult.quality < 3 ? existingStats.cards_incorrect + 1 : existingStats.cards_incorrect,
          accuracy_rate: ((existingStats.cards_correct + (reviewResult.quality >= 3 ? 1 : 0)) / (existingStats.cards_reviewed + 1)) * 100,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('date', today)
    } else {
      // Create new daily stats
      await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          date: today,
          cards_reviewed: 1,
          cards_learned: 0,
          cards_relearned: reviewResult.quality < 3 ? 1 : 0,
          cards_correct: reviewResult.quality >= 3 ? 1 : 0,
          cards_incorrect: reviewResult.quality < 3 ? 1 : 0,
          total_study_time_ms: 0,
          accuracy_rate: reviewResult.quality >= 3 ? 100 : 0,
          daily_streak: 1,
          longest_streak: 1
        })
    }
  }

  /**
   * Update daily statistics after a study session
   */
  private static async updateDailyStats(
    userId: string,
    results: {
      cards_studied: number
      new_cards: number
      review_cards: number
      correct_answers: number
      incorrect_answers: number
    },
    totalDurationMs: number,
    accuracyRate: number
  ) {
    const today = new Date().toISOString().split('T')[0]

    // Get or create today's stats
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (existingStats) {
      // Update existing stats
      const totalReviewed = existingStats.cards_reviewed + results.cards_studied
      const totalCorrect = existingStats.cards_correct + results.correct_answers
      const newAccuracyRate = totalReviewed > 0 ? (totalCorrect / totalReviewed) * 100 : 0

      await supabase
        .from('user_stats')
        .update({
          cards_reviewed: totalReviewed,
          cards_learned: existingStats.cards_learned + results.new_cards,
          cards_correct: totalCorrect,
          cards_incorrect: existingStats.cards_incorrect + results.incorrect_answers,
          total_study_time_ms: existingStats.total_study_time_ms + totalDurationMs,
          accuracy_rate: newAccuracyRate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('date', today)
    } else {
      // Create new daily stats
      await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          date: today,
          cards_reviewed: results.cards_studied,
          cards_learned: results.new_cards,
          cards_relearned: 0,
          cards_correct: results.correct_answers,
          cards_incorrect: results.incorrect_answers,
          total_study_time_ms: totalDurationMs,
          accuracy_rate: accuracyRate,
          daily_streak: 1,
          longest_streak: 1
        })
    }
  }

  /**
   * Initialize user data - create card schedules and achievements
   */
  static async initializeUserData(userId: string) {
    // Check if already initialized
    const { data: existingSchedules } = await supabase
      .from('card_schedule')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (existingSchedules && existingSchedules.length > 0) {
      return { already_initialized: true }
    }

    // Initialize card schedules using database function
    const { data: scheduleResult, error: scheduleError } = await supabase
      .rpc('initialize_user_card_schedule', { target_user_id: userId })

    if (scheduleError) {
      throw new Error(`Failed to initialize card schedules: ${scheduleError.message}`)
    }

    // Initialize achievements using database function
    const { data: achievementResult, error: achievementError } = await supabase
      .rpc('initialize_user_achievements', { target_user_id: userId })

    if (achievementError) {
      throw new Error(`Failed to initialize achievements: ${achievementError.message}`)
    }

    return {
      cards_initialized: scheduleResult,
      achievements_initialized: achievementResult
    }
  }
}
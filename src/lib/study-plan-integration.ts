/**
 * STUDY PLAN INTEGRATION SERVICE
 * 
 * Integrates the 24-week IELTS Study Plan with Spaced Repetition System
 * Provides intelligent recommendations based on study plan progress
 */

import { SpacedRepetitionService } from './spaced-repetition'

export interface StudyPlanWeek {
  week: number
  phase: 'Foundation' | 'Development' | 'Mastery' | 'Final Prep'
  vocabularyTarget: number
  grammarTarget: number
  skillsFocus: string[]
  dailyHours: number
  targetBand: string
}

export interface DailyStudyRecommendation {
  date: Date
  week: number
  totalMinutes: number
  sessions: StudySession[]
  prioritySkills: string[]
  vocabularyGoal: number
  reviewCards: number
  newCards: number
}

export interface StudySession {
  id: string
  time: string
  duration: number
  skill: string
  title: string
  description: string
  isCompleted: boolean
  integrationNotes?: string
}

export class StudyPlanIntegrationService {
  
  /**
   * Get current week information based on start date
   */
  static getCurrentWeek(startDate: Date): number {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.min(Math.ceil(diffDays / 7), 24)
  }

  /**
   * Get study plan week configuration
   */
  static getWeekConfig(weekNumber: number): StudyPlanWeek {
    if (weekNumber <= 8) {
      return {
        week: weekNumber,
        phase: 'Foundation',
        vocabularyTarget: 150 * weekNumber,
        grammarTarget: Math.min(weekNumber * 6, 50),
        skillsFocus: ['vocabulary', 'grammar', 'reading', 'listening'],
        dailyHours: 2.5,
        targetBand: weekNumber <= 4 ? '4.0-5.0' : '5.0-5.5'
      }
    } else if (weekNumber <= 16) {
      return {
        week: weekNumber,
        phase: 'Development',
        vocabularyTarget: 150 * weekNumber,
        grammarTarget: Math.min(weekNumber * 6, 100),
        skillsFocus: ['writing', 'speaking', 'advanced_reading', 'complex_grammar'],
        dailyHours: 3.0,
        targetBand: weekNumber <= 12 ? '5.5-6.0' : '6.0-6.5'
      }
    } else if (weekNumber <= 20) {
      return {
        week: weekNumber,
        phase: 'Mastery',
        vocabularyTarget: 150 * weekNumber,
        grammarTarget: Math.min(weekNumber * 6, 120),
        skillsFocus: ['band7_techniques', 'speed_accuracy', 'sophistication'],
        dailyHours: 3.5,
        targetBand: '6.5-7.0'
      }
    } else {
      return {
        week: weekNumber,
        phase: 'Final Prep',
        vocabularyTarget: 4000,
        grammarTarget: 145,
        skillsFocus: ['exam_strategies', 'mock_tests', 'confidence_building'],
        dailyHours: 3.0,
        targetBand: '7.0+'
      }
    }
  }

  /**
   * Generate daily study recommendation based on study plan + SR data
   */
  static async getDailyRecommendation(
    date: Date, 
    startDate: Date,
    currentProgress?: {
      vocabularyLearned: number
      grammarCompleted: number
      weeklyHours: number
    }
  ): Promise<DailyStudyRecommendation> {
    
    const currentWeek = this.getCurrentWeek(startDate)
    const weekConfig = this.getWeekConfig(currentWeek)
    
    // Get spaced repetition data
    const [dueCards, newCards, studySchedule] = await Promise.all([
      SpacedRepetitionService.getCardsDueForReview(50),
      SpacedRepetitionService.getNewCards(30),
      SpacedRepetitionService.getStudySchedule()
    ])

    // Calculate daily targets
    const vocabularyGap = Math.max(0, weekConfig.vocabularyTarget - (currentProgress?.vocabularyLearned || 0))
    const dailyVocabTarget = Math.min(Math.ceil(vocabularyGap / 7), 60) // Max 60 words/day
    
    // Determine optimal card distribution
    const totalDue = dueCards.length
    const totalNew = newCards.length
    const recommendedReviews = Math.min(totalDue, 40) // Don't overload
    const recommendedNew = Math.min(totalNew, Math.max(dailyVocabTarget - recommendedReviews, 10))

    // Generate study sessions based on week phase
    const sessions = this.generateDailySessions(weekConfig, {
      reviewCards: recommendedReviews,
      newCards: recommendedNew,
      vocabularyTarget: dailyVocabTarget,
      dueCardsCount: totalDue,
      studySchedule
    })

    return {
      date,
      week: currentWeek,
      totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
      sessions,
      prioritySkills: weekConfig.skillsFocus.slice(0, 3), // Top 3 skills
      vocabularyGoal: dailyVocabTarget,
      reviewCards: recommendedReviews,
      newCards: recommendedNew
    }
  }

  /**
   * Generate daily study sessions based on week configuration
   */
  private static generateDailySessions(
    weekConfig: StudyPlanWeek,
    srData: {
      reviewCards: number
      newCards: number
      vocabularyTarget: number
      dueCardsCount: number
      studySchedule: any
    }
  ): StudySession[] {
    const sessions: StudySession[] = []
    const dailyMinutes = weekConfig.dailyHours * 60

    // Morning vocabulary session (always first)
    sessions.push({
      id: 'morning-vocab',
      time: '7:00-7:45',
      duration: 45,
      skill: 'vocabulary',
      title: 'Vocabulary Review & Learning',
      description: `Review ${srData.reviewCards} due cards + Learn ${srData.newCards} new words`,
      isCompleted: false,
      integrationNotes: srData.dueCardsCount > 50 
        ? 'High backlog - focus on reviews today' 
        : 'Balanced new learning and review'
    })

    // Main skill sessions based on week phase
    if (weekConfig.phase === 'Foundation') {
      sessions.push(
        {
          id: 'grammar-focus',
          time: '8:00-9:00',
          duration: 60,
          skill: 'grammar',
          title: 'Grammar Foundation',
          description: 'Grammar in Use - Tenses and basic structures',
          isCompleted: false
        },
        {
          id: 'reading-practice',
          time: '14:00-15:00',
          duration: 60,
          skill: 'reading',
          title: 'Reading Skills Development',
          description: 'Cambridge IELTS passages - Skimming and scanning techniques',
          isCompleted: false
        },
        {
          id: 'listening-evening',
          time: '19:00-19:30',
          duration: 30,
          skill: 'listening',
          title: 'Daily Listening Practice',
          description: 'BBC 6 Minute English + Cambridge Listening sections',
          isCompleted: false
        }
      )
    } else if (weekConfig.phase === 'Development') {
      sessions.push(
        {
          id: 'writing-focus',
          time: '8:00-9:30',
          duration: 90,
          skill: 'writing',
          title: 'Writing Skills Development',
          description: 'Task 1 & 2 practice with time constraints',
          isCompleted: false
        },
        {
          id: 'speaking-practice',
          time: '14:00-14:45',
          duration: 45,
          skill: 'speaking',
          title: 'Speaking Fluency Building',
          description: 'Parts 1-3 practice with recording and self-assessment',
          isCompleted: false
        },
        {
          id: 'advanced-reading',
          time: '15:00-16:00',
          duration: 60,
          skill: 'reading',
          title: 'Advanced Reading Practice',
          description: 'Complex passages with all question types',
          isCompleted: false
        }
      )
    } else if (weekConfig.phase === 'Mastery') {
      sessions.push(
        {
          id: 'band7-techniques',
          time: '8:00-10:00',
          duration: 120,
          skill: 'mixed',
          title: 'Band 7+ Techniques',
          description: 'Advanced structures, sophisticated vocabulary usage',
          isCompleted: false
        },
        {
          id: 'speed-accuracy',
          time: '14:00-15:30',
          duration: 90,
          skill: 'mixed',
          title: 'Speed & Accuracy Training',
          description: 'Timed practice with strict time limits',
          isCompleted: false
        }
      )
    } else { // Final Prep
      sessions.push(
        {
          id: 'mock-test',
          time: '8:00-11:00',
          duration: 180,
          skill: 'mixed',
          title: 'Full Mock Test',
          description: 'Complete IELTS practice test under exam conditions',
          isCompleted: false
        },
        {
          id: 'error-analysis',
          time: '14:00-15:00',
          duration: 60,
          skill: 'mixed',
          title: 'Performance Analysis',
          description: 'Detailed error analysis and improvement strategies',
          isCompleted: false
        }
      )
    }

    return sessions
  }

  /**
   * Get weekly milestone progress
   */
  static async getWeeklyMilestones(weekNumber: number) {
    const weekConfig = this.getWeekConfig(weekNumber)
    
    // Get current progress from spaced repetition system
    const progress = await SpacedRepetitionService.getLearningProgress()
    
    const milestones = [
      {
        id: 'vocabulary',
        title: `${weekConfig.vocabularyTarget} Words Target`,
        description: `Learn ${weekConfig.vocabularyTarget} vocabulary words by end of week`,
        target: weekConfig.vocabularyTarget,
        current: progress.cardStates.find(s => s.state === 'mastered')?.count || 0,
        type: 'vocabulary'
      },
      {
        id: 'grammar',
        title: `${weekConfig.grammarTarget} Grammar Units`,
        description: `Complete ${weekConfig.grammarTarget} grammar units`,
        target: weekConfig.grammarTarget,
        current: 0, // Would need to be tracked separately
        type: 'grammar'
      },
      {
        id: 'daily-hours',
        title: `${weekConfig.dailyHours}h Daily Study`,
        description: `Maintain ${weekConfig.dailyHours} hours of daily study`,
        target: weekConfig.dailyHours * 7,
        current: 0, // Would come from session tracking
        type: 'time'
      },
      {
        id: 'band-score',
        title: `Target ${weekConfig.targetBand}`,
        description: `Achieve ${weekConfig.targetBand} in practice tests`,
        target: 100,
        current: 0, // Would come from mock test results
        type: 'score'
      }
    ]

    return {
      week: weekNumber,
      phase: weekConfig.phase,
      milestones,
      overallProgress: Math.round(
        milestones.reduce((sum, m) => sum + (m.current / m.target * 100), 0) / milestones.length
      )
    }
  }

  /**
   * Get personalized study recommendations
   */
  static async getPersonalizedRecommendations(
    currentWeek: number,
    recentPerformance: {
      accuracy: number
      averageTime: number
      weakSkills: string[]
      strongSkills: string[]
    }
  ) {
    const weekConfig = this.getWeekConfig(currentWeek)
    const recommendations: string[] = []

    // Performance-based recommendations
    if (recentPerformance.accuracy < 70) {
      recommendations.push('Focus on review sessions - accuracy needs improvement')
      recommendations.push('Reduce new card learning until accuracy improves')
    } else if (recentPerformance.accuracy > 90) {
      recommendations.push('Excellent accuracy! Consider increasing daily new cards')
      recommendations.push('Add more challenging vocabulary from advanced lists')
    }

    // Time-based recommendations
    if (recentPerformance.averageTime > 10000) { // 10 seconds
      recommendations.push('Work on response speed - practice quick recall')
      recommendations.push('Use speed drills for automatic recognition')
    }

    // Skill-specific recommendations
    recentPerformance.weakSkills.forEach(skill => {
      switch (skill) {
        case 'vocabulary':
          recommendations.push('Increase daily vocabulary review time')
          recommendations.push('Focus on word families and collocations')
          break
        case 'grammar':
          recommendations.push('Allocate more time to grammar exercises')
          recommendations.push('Practice complex sentence structures')
          break
        case 'reading':
          recommendations.push('Practice speed reading techniques')
          recommendations.push('Work on question type strategies')
          break
        case 'writing':
          recommendations.push('Focus on essay structure and coherence')
          recommendations.push('Build advanced linking expressions')
          break
      }
    })

    // Phase-specific recommendations
    if (weekConfig.phase === 'Foundation' && currentWeek > 4) {
      recommendations.push('Consider starting writing practice earlier')
      recommendations.push('Begin speaking confidence building')
    } else if (weekConfig.phase === 'Development' && currentWeek > 12) {
      recommendations.push('Increase mock test frequency')
      recommendations.push('Focus on time management strategies')
    }

    return {
      week: currentWeek,
      phase: weekConfig.phase,
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      actionItems: [
        'Adjust daily study schedule based on weak skills',
        'Set specific targets for next week',
        'Review and update study plan if needed'
      ]
    }
  }

  /**
   * Generate study plan analytics
   */
  static async getStudyPlanAnalytics(startDate: Date, currentWeek: number) {
    const weekConfig = this.getWeekConfig(currentWeek)
    const progress = await SpacedRepetitionService.getLearningProgress()
    
    // Calculate progress velocity
    const expectedVocabulary = (weekConfig.vocabularyTarget / currentWeek) * currentWeek
    const actualVocabulary = progress.cardStates.find(s => s.state === 'mastered')?.count || 0
    const velocityRatio = actualVocabulary / expectedVocabulary

    // Predict completion timeline
    const remainingWeeks = 24 - currentWeek
    const currentVelocity = actualVocabulary / currentWeek
    const projectedCompletion = remainingWeeks / currentVelocity

    return {
      currentWeek,
      phase: weekConfig.phase,
      progress: {
        vocabulary: {
          target: weekConfig.vocabularyTarget,
          actual: actualVocabulary,
          percentage: Math.round((actualVocabulary / weekConfig.vocabularyTarget) * 100)
        },
        velocity: {
          ratio: velocityRatio,
          status: velocityRatio > 1.1 ? 'ahead' : velocityRatio < 0.9 ? 'behind' : 'on_track'
        },
        projection: {
          estimatedCompletion: Math.round(projectedCompletion),
          onTarget: projectedCompletion <= remainingWeeks
        }
      },
      recommendations: velocityRatio < 0.9 
        ? ['Increase daily study time', 'Focus on high-yield activities', 'Consider extending timeline']
        : velocityRatio > 1.1
        ? ['Maintain current pace', 'Consider advancing to next phase', 'Add challenge activities']
        : ['Stay consistent', 'Continue current approach', 'Monitor weekly progress']
    }
  }
}

// Helper functions for UI components
export const formatWeekPhase = (week: number): { phase: string; color: string } => {
  if (week <= 8) return { phase: 'Foundation', color: 'bg-blue-100 text-blue-800' }
  if (week <= 16) return { phase: 'Development', color: 'bg-green-100 text-green-800' }
  if (week <= 20) return { phase: 'Mastery', color: 'bg-purple-100 text-purple-800' }
  return { phase: 'Final Prep', color: 'bg-orange-100 text-orange-800' }
}

export const getSkillPriority = (phase: string, week: number): string[] => {
  switch (phase) {
    case 'Foundation':
      return ['vocabulary', 'grammar', 'reading', 'listening']
    case 'Development':
      return ['writing', 'speaking', 'advanced_reading', 'complex_grammar']
    case 'Mastery':
      return ['band7_techniques', 'speed_accuracy', 'sophistication']
    case 'Final Prep':
      return ['exam_strategies', 'mock_tests', 'confidence_building']
    default:
      return ['vocabulary', 'grammar', 'reading', 'writing']
  }
}
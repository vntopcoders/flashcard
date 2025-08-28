import { Achievement } from '@/components/AchievementBadge'

export interface UserStats {
  vocabularyLearned: number
  studyStreak: number
  accuracy: number
  averageTime: number
  mockTestsCompleted: number
  grammarUnitsCompleted: number
  studyHours: number
  bandScore: number
  perfectDays: number
  reviewsCompleted: number
  speedImprovements: number
}

export interface AchievementProgress {
  achievementId: string
  progress: number
  isUnlocked: boolean
  unlockedAt?: Date
}

export class AchievementSystem {
  private static achievements: Achievement[] = [
    // Vocabulary Achievements
    {
      id: 'vocab_100',
      title: 'First Century',
      description: 'Learn your first 100 vocabulary words',
      icon: '📚',
      type: 'vocabulary',
      requirement: 100,
      progress: 0,
      isUnlocked: false,
      rarity: 'bronze',
      points: 100
    },
    {
      id: 'vocab_500',
      title: 'Word Explorer',
      description: 'Master 500 vocabulary words',
      icon: '🗺️',
      type: 'vocabulary',
      requirement: 500,
      progress: 0,
      isUnlocked: false,
      rarity: 'silver',
      points: 300
    },
    {
      id: 'vocab_1000',
      title: 'Vocabulary Expert',
      description: 'Learn 1000 vocabulary words',
      icon: '🎓',
      type: 'vocabulary',
      requirement: 1000,
      progress: 0,
      isUnlocked: false,
      rarity: 'gold',
      points: 500
    },
    {
      id: 'vocab_2500',
      title: 'Word Master',
      description: 'Master 2500 academic vocabulary words',
      icon: '👑',
      type: 'vocabulary',
      requirement: 2500,
      progress: 0,
      isUnlocked: false,
      rarity: 'platinum',
      points: 1000
    },
    
    // Streak Achievements  
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Study for 7 consecutive days',
      icon: '🔥',
      type: 'streak',
      requirement: 7,
      progress: 0,
      isUnlocked: false,
      rarity: 'bronze',
      points: 150
    },
    {
      id: 'streak_30',
      title: 'Month Master',
      description: 'Maintain a 30-day study streak',
      icon: '⚡',
      type: 'streak',
      requirement: 30,
      progress: 0,
      isUnlocked: false,
      rarity: 'silver',
      points: 400
    },
    {
      id: 'streak_100',
      title: 'Century Streaker',
      description: 'Study for 100 consecutive days',
      icon: '💯',
      type: 'streak',
      requirement: 100,
      progress: 0,
      isUnlocked: false,
      rarity: 'gold',
      points: 800
    },

    // Accuracy Achievements
    {
      id: 'accuracy_80',
      title: 'Sharp Shooter',
      description: 'Maintain 80% accuracy for a week',
      icon: '🎯',
      type: 'accuracy',
      requirement: 80,
      progress: 0,
      isUnlocked: false,
      rarity: 'bronze',
      points: 200
    },
    {
      id: 'accuracy_90',
      title: 'Precision Pro',
      description: 'Achieve 90% accuracy for a week',
      icon: '🏹',
      type: 'accuracy',
      requirement: 90,
      progress: 0,
      isUnlocked: false,
      rarity: 'silver',
      points: 350
    },
    {
      id: 'accuracy_95',
      title: 'Perfect Precision',
      description: 'Maintain 95% accuracy for a week',
      icon: '🥇',
      type: 'accuracy',
      requirement: 95,
      progress: 0,
      isUnlocked: false,
      rarity: 'gold',
      points: 600
    },

    // Speed Achievements
    {
      id: 'speed_5s',
      title: 'Quick Thinker',
      description: 'Average response time under 5 seconds',
      icon: '⚡',
      type: 'speed',
      requirement: 5,
      progress: 10,
      isUnlocked: false,
      rarity: 'bronze',
      points: 150
    },
    {
      id: 'speed_3s',
      title: 'Lightning Fast',
      description: 'Average response time under 3 seconds',
      icon: '🌩️',
      type: 'speed',
      requirement: 3,
      progress: 10,
      isUnlocked: false,
      rarity: 'silver',
      points: 300
    },
    {
      id: 'speed_1s',
      title: 'Instant Recall',
      description: 'Average response time under 1 second',
      icon: '💨',
      type: 'speed',
      requirement: 1,
      progress: 10,
      isUnlocked: false,
      rarity: 'gold',
      points: 500
    },

    // Band Score Achievements
    {
      id: 'band_5',
      title: 'Intermediate Level',
      description: 'Reach IELTS Band 5.0 in mock tests',
      icon: '📈',
      type: 'band_score',
      requirement: 50,
      progress: 0,
      isUnlocked: false,
      rarity: 'bronze',
      points: 250
    },
    {
      id: 'band_6',
      title: 'Competent User',
      description: 'Achieve IELTS Band 6.0 in mock tests',
      icon: '🎊',
      type: 'band_score',
      requirement: 60,
      progress: 0,
      isUnlocked: false,
      rarity: 'silver',
      points: 400
    },
    {
      id: 'band_7',
      title: 'Good User',
      description: 'Reach IELTS Band 7.0 in mock tests',
      icon: '🌟',
      type: 'band_score',
      requirement: 70,
      progress: 0,
      isUnlocked: false,
      rarity: 'gold',
      points: 700
    },
    {
      id: 'band_8',
      title: 'Very Good User',
      description: 'Achieve IELTS Band 8.0 in mock tests',
      icon: '💫',
      type: 'band_score',
      requirement: 80,
      progress: 0,
      isUnlocked: false,
      rarity: 'platinum',
      points: 1200
    },

    // Milestone Achievements
    {
      id: 'week_4',
      title: 'Foundation Built',
      description: 'Complete first month of study plan',
      icon: '🏗️',
      type: 'milestone',
      requirement: 4,
      progress: 0,
      isUnlocked: false,
      rarity: 'bronze',
      points: 200
    },
    {
      id: 'week_12',
      title: 'Quarter Master',
      description: 'Complete 12 weeks of study plan',
      icon: '🏛️',
      type: 'milestone',
      requirement: 12,
      progress: 0,
      isUnlocked: false,
      rarity: 'silver',
      points: 500
    },
    {
      id: 'week_24',
      title: 'Journey Complete',
      description: 'Complete the full 24-week IELTS journey',
      icon: '🏆',
      type: 'milestone',
      requirement: 24,
      progress: 0,
      isUnlocked: false,
      rarity: 'platinum',
      points: 1500
    },

    // Grammar Achievements
    {
      id: 'grammar_20',
      title: 'Grammar Novice',
      description: 'Complete 20 grammar units',
      icon: '📝',
      type: 'grammar',
      requirement: 20,
      progress: 0,
      isUnlocked: false,
      rarity: 'bronze',
      points: 150
    },
    {
      id: 'grammar_50',
      title: 'Grammar Expert',
      description: 'Master 50 grammar units',
      icon: '✍️',
      type: 'grammar',
      requirement: 50,
      progress: 0,
      isUnlocked: false,
      rarity: 'silver',
      points: 300
    },
    {
      id: 'grammar_100',
      title: 'Grammar Master',
      description: 'Complete 100 grammar units',
      icon: '🖋️',
      type: 'grammar',
      requirement: 100,
      progress: 0,
      isUnlocked: false,
      rarity: 'gold',
      points: 600
    }
  ]

  static getAllAchievements(): Achievement[] {
    return this.achievements
  }

  static getAchievementById(id: string): Achievement | undefined {
    return this.achievements.find(a => a.id === id)
  }

  static updateAchievementProgress(userStats: UserStats): { 
    newlyUnlocked: Achievement[]
    updated: Achievement[]
  } {
    const newlyUnlocked: Achievement[] = []
    const updated: Achievement[] = []

    this.achievements.forEach(achievement => {
      const oldProgress = achievement.progress
      const wasUnlocked = achievement.isUnlocked

      // Update progress based on achievement type
      switch (achievement.type) {
        case 'vocabulary':
          achievement.progress = userStats.vocabularyLearned
          break
        case 'streak':
          achievement.progress = userStats.studyStreak
          break
        case 'accuracy':
          achievement.progress = userStats.accuracy
          break
        case 'speed':
          achievement.progress = achievement.requirement > userStats.averageTime / 1000 ? achievement.requirement : userStats.averageTime / 1000
          break
        case 'band_score':
          achievement.progress = userStats.bandScore * 10
          break
        case 'milestone':
          // This would come from study plan progress
          achievement.progress = Math.floor(userStats.studyHours / 168) // Rough estimate based on hours
          break
        case 'grammar':
          achievement.progress = userStats.grammarUnitsCompleted
          break
      }

      // Check if achievement is newly unlocked
      if (!wasUnlocked && achievement.progress >= achievement.requirement) {
        achievement.isUnlocked = true
        achievement.unlockedAt = new Date()
        newlyUnlocked.push(achievement)
      }

      // Track if progress changed
      if (oldProgress !== achievement.progress || wasUnlocked !== achievement.isUnlocked) {
        updated.push(achievement)
      }
    })

    return { newlyUnlocked, updated }
  }

  static calculateLevel(totalPoints: number): number {
    // Level calculation: 100 points per level, with increasing requirements
    if (totalPoints < 100) return 1
    return Math.floor(Math.sqrt(totalPoints / 50)) + 1
  }

  static getPointsForNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints)
    const nextLevelPoints = Math.pow(currentLevel, 2) * 50
    return nextLevelPoints - currentPoints
  }

  static getTotalPoints(achievements: Achievement[]): number {
    return achievements
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.points, 0)
  }

  static getAchievementsByType(type: Achievement['type']): Achievement[] {
    return this.achievements.filter(a => a.type === type)
  }

  static getRecentAchievements(days: number = 7): Achievement[] {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    
    return this.achievements
      .filter(a => a.isUnlocked && a.unlockedAt && a.unlockedAt > cutoff)
      .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
  }

  static getNextAchievements(limit: number = 3): Achievement[] {
    return this.achievements
      .filter(a => !a.isUnlocked && a.progress > 0)
      .sort((a, b) => {
        const aProgress = a.progress / a.requirement
        const bProgress = b.progress / b.requirement
        return bProgress - aProgress
      })
      .slice(0, limit)
  }

  static simulateProgress(userStats: UserStats): Achievement[] {
    // Create a deep copy for simulation
    const simulated = JSON.parse(JSON.stringify(this.achievements)) as Achievement[]
    
    simulated.forEach(achievement => {
      switch (achievement.type) {
        case 'vocabulary':
          achievement.progress = Math.min(userStats.vocabularyLearned, achievement.requirement)
          break
        case 'streak':
          achievement.progress = Math.min(userStats.studyStreak, achievement.requirement)
          break
        case 'accuracy':
          achievement.progress = Math.min(userStats.accuracy, achievement.requirement)
          break
        case 'speed':
          achievement.progress = Math.max(0, achievement.requirement - (userStats.averageTime / 1000))
          break
        case 'band_score':
          achievement.progress = Math.min(userStats.bandScore * 10, achievement.requirement)
          break
        case 'grammar':
          achievement.progress = Math.min(userStats.grammarUnitsCompleted, achievement.requirement)
          break
      }
      
      achievement.isUnlocked = achievement.progress >= achievement.requirement
      if (achievement.isUnlocked && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date()
      }
    })

    return simulated
  }
}
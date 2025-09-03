import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { AchievementSystem } from '@/lib/achievement-system'

// Get user achievements
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    
    // Get real user statistics
    let userStats = {
      vocabularyLearned: 0,
      studyStreak: 0,
      accuracy: 85,
      averageTime: 4500,
      mockTestsCompleted: 0,
      grammarUnitsCompleted: 0,
      studyHours: 0,
      bandScore: 5.5,
      perfectDays: 0,
      reviewsCompleted: 0,
      speedImprovements: 0
    }

    if (userId) {
      try {
        // Fetch real user progress
        const userResponse = await fetch(`${request.nextUrl.origin}/api/user/sync-progress?user_id=${userId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.success && userData.data.user_progress) {
            const progress = userData.data.user_progress
            userStats = {
              vocabularyLearned: progress.total_words_learned || 0,
              studyStreak: progress.study_streak || 0,
              accuracy: 85, // Default for now
              averageTime: 4500,
              mockTestsCompleted: Math.floor((progress.total_days_studied || 0) / 7), // Weekly tests
              grammarUnitsCompleted: Math.floor((progress.total_days_studied || 0) * 1.2),
              studyHours: (progress.total_days_studied || 0) * 2.5, // Estimate 2.5h per day
              bandScore: progress.current_estimated_score || 5.5,
              perfectDays: progress.total_days_studied || 0,
              reviewsCompleted: (progress.total_words_learned || 0) * 3, // Estimate
              speedImprovements: Math.floor((progress.total_days_studied || 0) / 10)
            }
          }
        }
      } catch (error) {
        console.log('Using default user stats:', error)
      }
    }

    // Simulate achievements with current progress
    const achievements = AchievementSystem.simulateProgress(userStats)
    const totalPoints = AchievementSystem.getTotalPoints(achievements)
    const level = AchievementSystem.calculateLevel(totalPoints)
    const pointsForNext = AchievementSystem.getPointsForNextLevel(totalPoints)

    return NextResponse.json({
      success: true,
      data: {
        achievements,
        totalPoints,
        level,
        pointsForNext,
        stats: {
          unlockedCount: achievements.filter(a => a.isUnlocked).length,
          totalCount: achievements.length,
          completionRate: Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100),
          recentAchievements: AchievementSystem.getRecentAchievements(7).map(a => ({
            ...a,
            progress: achievements.find(sim => sim.id === a.id)?.progress || a.progress,
            isUnlocked: achievements.find(sim => sim.id === a.id)?.isUnlocked || a.isUnlocked
          })),
          nextAchievements: AchievementSystem.getNextAchievements(3).map(a => ({
            ...a,
            progress: achievements.find(sim => sim.id === a.id)?.progress || a.progress
          }))
        }
      }
    })

  } catch (error) {
    console.error('Failed to get achievements:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get achievements'
      },
      { status: 500 }
    )
  }
}

// Update achievement progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userStats } = body

    if (!userStats) {
      return NextResponse.json(
        { success: false, error: 'User stats required' },
        { status: 400 }
      )
    }

    // Update achievements based on user stats
    const { newlyUnlocked, updated } = AchievementSystem.updateAchievementProgress(userStats)
    
    // In a real app, you would save these to database
    // For now, we'll return the updates
    
    const totalPoints = AchievementSystem.getTotalPoints(AchievementSystem.getAllAchievements())
    const level = AchievementSystem.calculateLevel(totalPoints)

    return NextResponse.json({
      success: true,
      message: `Updated ${updated.length} achievements`,
      data: {
        newlyUnlocked: newlyUnlocked.map(a => ({
          id: a.id,
          title: a.title,
          points: a.points,
          rarity: a.rarity
        })),
        updatedCount: updated.length,
        totalPoints,
        level,
        nextAchievements: AchievementSystem.getNextAchievements(3)
      }
    })

  } catch (error) {
    console.error('Failed to update achievements:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update achievements'
      },
      { status: 500 }
    )
  }
}

// Get achievement statistics
export async function PUT() {
  try {
    const achievements = AchievementSystem.getAllAchievements()
    
    const stats = {
      total: achievements.length,
      unlocked: achievements.filter(a => a.isUnlocked).length,
      byRarity: {
        bronze: achievements.filter(a => a.rarity === 'bronze').length,
        silver: achievements.filter(a => a.rarity === 'silver').length,
        gold: achievements.filter(a => a.rarity === 'gold').length,
        platinum: achievements.filter(a => a.rarity === 'platinum').length
      },
      byType: {
        vocabulary: achievements.filter(a => a.type === 'vocabulary').length,
        streak: achievements.filter(a => a.type === 'streak').length,
        accuracy: achievements.filter(a => a.type === 'accuracy').length,
        speed: achievements.filter(a => a.type === 'speed').length,
        band_score: achievements.filter(a => a.type === 'band_score').length,
        milestone: achievements.filter(a => a.type === 'milestone').length,
        grammar: achievements.filter(a => a.type === 'grammar').length
      },
      totalPoints: achievements.reduce((sum, a) => sum + a.points, 0),
      averagePoints: Math.round(achievements.reduce((sum, a) => sum + a.points, 0) / achievements.length)
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Failed to get achievement stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get stats'
      },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { AchievementSystem } from '@/lib/achievement-system'

// Get user achievements
export async function GET() {
  try {
    // Get user statistics (simulated for now)
    const mockUserStats = {
      vocabularyLearned: 450,
      studyStreak: 12,
      accuracy: 85,
      averageTime: 4500, // 4.5 seconds
      mockTestsCompleted: 3,
      grammarUnitsCompleted: 25,
      studyHours: 84,
      bandScore: 5.5,
      perfectDays: 8,
      reviewsCompleted: 1250,
      speedImprovements: 15
    }

    // Simulate achievements with current progress
    const achievements = AchievementSystem.simulateProgress(mockUserStats)
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
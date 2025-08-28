'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, Star, Zap } from 'lucide-react'
import AchievementHeader from './AchievementHeader'
import AchievementPanel from './AchievementPanel'
import AchievementToast from './AchievementToast'
import AchievementBadge, { Achievement } from './AchievementBadge'

export default function AchievementDashboard() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userLevel, setUserLevel] = useState(1)
  const [totalPoints, setTotalPoints] = useState(0)
  const [pointsForNext, setPointsForNext] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vocabulary' | 'streak' | 'accuracy' | 'speed' | 'band_score' | 'milestone' | 'grammar'>('all')

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/achievements')
      const result = await response.json()
      
      if (result.success) {
        setAchievements(result.data.achievements)
        setUserLevel(result.data.level)
        setTotalPoints(result.data.totalPoints)
        setPointsForNext(result.data.pointsForNext)
      }
    } catch (error) {
      console.error('Failed to load achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    return selectedCategory === 'all' || achievement.type === selectedCategory
  })

  const recentAchievements = achievements
    .filter(a => a.isUnlocked)
    .sort((a, b) => {
      const aTime = a.unlockedAt ? (a.unlockedAt instanceof Date ? a.unlockedAt.getTime() : new Date(a.unlockedAt).getTime()) : 0
      const bTime = b.unlockedAt ? (b.unlockedAt instanceof Date ? b.unlockedAt.getTime() : new Date(b.unlockedAt).getTime()) : 0
      return bTime - aTime
    })
    .slice(0, 5)

  const nextAchievements = achievements
    .filter(a => !a.isUnlocked && a.progress > 0)
    .sort((a, b) => (b.progress / b.requirement) - (a.progress / a.requirement))
    .slice(0, 3)

  const categoryStats = [
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      icon: '📚',
      color: 'bg-blue-100 text-blue-800',
      total: achievements.filter(a => a.type === 'vocabulary').length,
      unlocked: achievements.filter(a => a.type === 'vocabulary' && a.isUnlocked).length
    },
    {
      id: 'streak',
      title: 'Streaks',
      icon: '🔥',
      color: 'bg-red-100 text-red-800',
      total: achievements.filter(a => a.type === 'streak').length,
      unlocked: achievements.filter(a => a.type === 'streak' && a.isUnlocked).length
    },
    {
      id: 'accuracy',
      title: 'Accuracy',
      icon: '🎯',
      color: 'bg-green-100 text-green-800',
      total: achievements.filter(a => a.type === 'accuracy').length,
      unlocked: achievements.filter(a => a.type === 'accuracy' && a.isUnlocked).length
    },
    {
      id: 'speed',
      title: 'Speed',
      icon: '⚡',
      color: 'bg-yellow-100 text-yellow-800',
      total: achievements.filter(a => a.type === 'speed').length,
      unlocked: achievements.filter(a => a.type === 'speed' && a.isUnlocked).length
    },
    {
      id: 'band_score',
      title: 'Band Score',
      icon: '🌟',
      color: 'bg-purple-100 text-purple-800',
      total: achievements.filter(a => a.type === 'band_score').length,
      unlocked: achievements.filter(a => a.type === 'band_score' && a.isUnlocked).length
    },
    {
      id: 'milestone',
      title: 'Milestones',
      icon: '🏆',
      color: 'bg-orange-100 text-orange-800',
      total: achievements.filter(a => a.type === 'milestone').length,
      unlocked: achievements.filter(a => a.type === 'milestone' && a.isUnlocked).length
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏆</div>
          <div className="text-lg text-gray-600">Loading your achievements...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏆 Achievement Center
          </h1>
          <p className="text-gray-600 text-lg">
            Track your IELTS learning journey and celebrate your progress
          </p>
        </div>

        {/* Achievement Header */}
        <AchievementHeader
          level={userLevel}
          totalPoints={totalPoints}
          pointsForNext={pointsForNext}
          recentAchievements={recentAchievements}
          nextAchievements={nextAchievements}
          onShowAll={() => setShowAllAchievements(true)}
        />

        {/* Category Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryStats.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id as typeof selectedCategory)}
              className={`
                bg-white rounded-lg p-4 shadow-sm border-2 transition-all duration-200 cursor-pointer
                ${selectedCategory === category.id 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-800 text-sm">
                  {category.title}
                </div>
                <div className="text-xs text-gray-500">
                  {category.unlocked}/{category.total}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(category.unlocked / category.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({achievements.length})
            </button>
            {categoryStats.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as typeof selectedCategory)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.icon} {category.title} ({category.total})
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCategory === 'all' ? 'All Achievements' : `${categoryStats.find(c => c.id === selectedCategory)?.title} Achievements`}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredAchievements.filter(a => a.isUnlocked).length} of {filteredAchievements.length} unlocked
            </div>
          </div>

          {filteredAchievements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <div className="text-xl font-semibold text-gray-600 mb-2">
                No achievements in this category
              </div>
              <p className="text-gray-500">
                Keep studying to unlock your first achievements!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {filteredAchievements.map((achievement) => (
                <div key={achievement.id} className="flex flex-col items-center space-y-2">
                  <AchievementBadge
                    achievement={achievement}
                    size="large"
                    showProgress={true}
                    onClick={() => console.log('Achievement clicked:', achievement)}
                  />
                  <div className="text-center">
                    <div className="font-medium text-sm text-gray-800 truncate max-w-24">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {achievement.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {achievements.filter(a => a.isUnlocked).length}
            </div>
            <div className="text-sm text-gray-600">
              Achievements Unlocked
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Star className="w-12 h-12 mx-auto mb-3 text-blue-500" />
            <div className="text-2xl font-bold text-gray-800 mb-1">
              Level {userLevel}
            </div>
            <div className="text-sm text-gray-600">
              Current Level
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Zap className="w-12 h-12 mx-auto mb-3 text-purple-500" />
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Total Points Earned
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Panel */}
      <AchievementPanel
        isOpen={showAllAchievements}
        onClose={() => setShowAllAchievements(false)}
        achievements={achievements}
        totalPoints={totalPoints}
        level={userLevel}
        onAchievementClick={(achievement) => {
          console.log('Achievement clicked:', achievement)
        }}
      />

      {/* Achievement Toast */}
      <AchievementToast
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import AchievementBadge, { Achievement } from './AchievementBadge'

interface AchievementPanelProps {
  isOpen: boolean
  onClose: () => void
  achievements: Achievement[]
  totalPoints: number
  level: number
  onAchievementClick?: (achievement: Achievement) => void
}

export default function AchievementPanel({ 
  isOpen, 
  onClose, 
  achievements, 
  totalPoints,
  level,
  onAchievementClick 
}: AchievementPanelProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'points'>('recent')
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.isUnlocked
    if (filter === 'locked') return !achievement.isUnlocked
    return true
  })

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === 'recent') {
      if (a.isUnlocked && b.isUnlocked) {
        const aTime = a.unlockedAt ? (a.unlockedAt instanceof Date ? a.unlockedAt.getTime() : new Date(a.unlockedAt).getTime()) : 0
        const bTime = b.unlockedAt ? (b.unlockedAt instanceof Date ? b.unlockedAt.getTime() : new Date(b.unlockedAt).getTime()) : 0
        return bTime - aTime
      }
      return (b.isUnlocked ? 1 : 0) - (a.isUnlocked ? 1 : 0)
    }
    
    if (sortBy === 'progress') {
      const aProgress = a.progress / a.requirement
      const bProgress = b.progress / b.requirement
      return bProgress - aProgress
    }
    
    if (sortBy === 'points') {
      return b.points - a.points
    }
    
    return 0
  })

  const unlockedCount = achievements.filter(a => a.isUnlocked).length
  const completionRate = Math.round((unlockedCount / achievements.length) * 100)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Achievements</h2>
              <div className="flex items-center gap-4 text-blue-100">
                <span>Level {level}</span>
                <span>•</span>
                <span>{totalPoints.toLocaleString()} points</span>
                <span>•</span>
                <span>{unlockedCount}/{achievements.length} unlocked</span>
                <span>•</span>
                <span>{completionRate}% complete</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-blue-800 rounded-full h-2">
              <div 
                className="bg-yellow-400 rounded-full h-2 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                All ({achievements.length})
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unlocked' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Unlocked ({unlockedCount})
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'locked' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Locked ({achievements.length - unlockedCount})
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recent</option>
                <option value="progress">Progress</option>
                <option value="points">Points</option>
              </select>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="p-6 overflow-y-auto max-h-96">
          {sortedAchievements.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">🏆</div>
              <p>No achievements found for the current filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {sortedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex flex-col items-center">
                  <AchievementBadge
                    achievement={achievement}
                    size="large"
                    showProgress={true}
                    onClick={() => onAchievementClick?.(achievement)}
                  />
                  <div className="mt-2 text-center">
                    <div className="font-medium text-sm text-gray-800 truncate max-w-24">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {achievement.isUnlocked ? (
                        <span className="text-green-600">✓ Unlocked</span>
                      ) : (
                        <span>{achievement.progress}/{achievement.requirement}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {achievements.filter(a => a.rarity === 'bronze' && a.isUnlocked).length}
              </div>
              <div className="text-xs text-gray-600">Bronze</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {achievements.filter(a => a.rarity === 'silver' && a.isUnlocked).length}
              </div>
              <div className="text-xs text-gray-600">Silver</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {achievements.filter(a => a.rarity === 'gold' && a.isUnlocked).length}
              </div>
              <div className="text-xs text-gray-600">Gold</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {achievements.filter(a => a.rarity === 'platinum' && a.isUnlocked).length}
              </div>
              <div className="text-xs text-gray-600">Platinum</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
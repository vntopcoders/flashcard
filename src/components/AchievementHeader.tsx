'use client'

import React, { useState, useEffect } from 'react'
import AchievementBadge, { Achievement } from './AchievementBadge'

interface AchievementHeaderProps {
  level: number
  totalPoints: number
  pointsForNext: number
  recentAchievements: Achievement[]
  nextAchievements: Achievement[]
  onShowAll: () => void
}

export default function AchievementHeader({
  level,
  totalPoints,
  pointsForNext,
  recentAchievements,
  nextAchievements,
  onShowAll
}: AchievementHeaderProps) {
  const [currentPoints, setCurrentPoints] = useState(0)
  
  // Animate points counter
  useEffect(() => {
    const duration = 1000
    const steps = 50
    const increment = totalPoints / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= totalPoints) {
        setCurrentPoints(totalPoints)
        clearInterval(timer)
      } else {
        setCurrentPoints(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [totalPoints])

  const levelProgress = ((totalPoints - (Math.pow(level - 1, 2) * 50)) / (Math.pow(level, 2) * 50 - Math.pow(level - 1, 2) * 50)) * 100

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        {/* Level and Points */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-2xl font-bold">{level}</span>
            </div>
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
              LVL
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold">
              {currentPoints.toLocaleString()} Points
            </div>
            <div className="text-blue-200 text-sm">
              {pointsForNext.toLocaleString()} points to Level {level + 1}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <button
          onClick={onShowAll}
          className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-medium"
        >
          View All Achievements
        </button>
      </div>

      {/* Level Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Level {level}</span>
          <span>Level {level + 1}</span>
        </div>
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-2 transition-all duration-1000 ease-out"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-yellow-300">🏆</span>
            Recent Achievements
          </h3>
          {recentAchievements.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {recentAchievements.slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="flex-shrink-0">
                  <AchievementBadge
                    achievement={achievement}
                    size="small"
                    showProgress={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-blue-200 text-sm italic">
              No recent achievements. Keep studying to earn your first!
            </div>
          )}
        </div>

        {/* Next Achievements */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-orange-300">🎯</span>
            Almost There
          </h3>
          {nextAchievements.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {nextAchievements.map((achievement) => (
                <div key={achievement.id} className="flex-shrink-0">
                  <AchievementBadge
                    achievement={achievement}
                    size="small"
                    showProgress={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-blue-200 text-sm italic">
              All achievements unlocked! You&apos;re amazing! 🌟
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span>🥉 Bronze: {recentAchievements.filter(a => a.rarity === 'bronze').length}</span>
            <span>🥈 Silver: {recentAchievements.filter(a => a.rarity === 'silver').length}</span>
            <span>🥇 Gold: {recentAchievements.filter(a => a.rarity === 'gold').length}</span>
            <span>💎 Platinum: {recentAchievements.filter(a => a.rarity === 'platinum').length}</span>
          </div>
          <div className="text-blue-200">
            Keep up the great work!
          </div>
        </div>
      </div>
    </div>
  )
}
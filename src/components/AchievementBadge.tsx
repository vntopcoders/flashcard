'use client'

import React from 'react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: 'vocabulary' | 'grammar' | 'streak' | 'milestone' | 'accuracy' | 'speed' | 'band_score'
  requirement: number
  progress: number
  isUnlocked: boolean
  unlockedAt?: Date
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum'
  points: number
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'small' | 'medium' | 'large'
  showProgress?: boolean
  onClick?: () => void
}

const rarityColors = {
  bronze: {
    bg: 'bg-gradient-to-br from-amber-600 to-amber-800',
    border: 'border-amber-500',
    glow: 'shadow-amber-500/50'
  },
  silver: {
    bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
    border: 'border-gray-400',
    glow: 'shadow-gray-400/50'
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    border: 'border-yellow-400',
    glow: 'shadow-yellow-400/50'
  },
  platinum: {
    bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    border: 'border-purple-400',
    glow: 'shadow-purple-400/50'
  }
}

const sizeClasses = {
  small: {
    container: 'w-16 h-16',
    icon: 'text-xl',
    badge: 'w-5 h-5 text-xs'
  },
  medium: {
    container: 'w-20 h-20',
    icon: 'text-2xl',
    badge: 'w-6 h-6 text-sm'
  },
  large: {
    container: 'w-24 h-24',
    icon: 'text-3xl',
    badge: 'w-8 h-8 text-base'
  }
}

export default function AchievementBadge({ 
  achievement, 
  size = 'medium', 
  showProgress = true,
  onClick 
}: AchievementBadgeProps) {
  const { isUnlocked, rarity, progress, requirement } = achievement
  const colors = rarityColors[rarity]
  const sizes = sizeClasses[size]
  
  const progressPercentage = Math.min((progress / requirement) * 100, 100)

  return (
    <div 
      className={`relative ${sizes.container} cursor-pointer transition-all duration-300 hover:scale-105 group`}
      onClick={onClick}
    >
      {/* Main Badge */}
      <div 
        className={`
          w-full h-full rounded-full border-2 
          ${isUnlocked 
            ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}` 
            : 'bg-gray-200 border-gray-300 grayscale'
          }
          flex items-center justify-center text-white font-bold
          transition-all duration-300 group-hover:shadow-xl
        `}
      >
        <span className={sizes.icon}>{achievement.icon}</span>
      </div>

      {/* Progress Ring for Locked Achievements */}
      {!isUnlocked && showProgress && progress > 0 && (
        <div className="absolute inset-0">
          <svg 
            className="w-full h-full transform -rotate-90" 
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgb(229 231 235)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isUnlocked ? colors.border.replace('border-', 'rgb(') + ')' : 'rgb(59 130 246)'}
              strokeWidth="6"
              strokeDasharray={`${progressPercentage * 2.83} 283`}
              className="transition-all duration-500"
            />
          </svg>
        </div>
      )}

      {/* Rarity Indicator */}
      <div 
        className={`
          absolute -top-1 -right-1 ${sizes.badge}
          ${colors.bg} ${colors.border} border
          rounded-full flex items-center justify-center
          text-white font-bold
          ${!isUnlocked && 'opacity-50'}
        `}
      >
        {rarity === 'bronze' && '🥉'}
        {rarity === 'silver' && '🥈'}
        {rarity === 'gold' && '🥇'}
        {rarity === 'platinum' && '💎'}
      </div>

      {/* New Achievement Glow */}
      {isUnlocked && achievement.unlockedAt && 
       new Date().getTime() - achievement.unlockedAt.getTime() < 5000 && (
        <div className={`
          absolute inset-0 rounded-full animate-ping
          ${colors.bg} opacity-75
        `} />
      )}

      {/* Tooltip */}
      <div className="
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
        bg-gray-800 text-white text-sm rounded-lg px-3 py-2
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        pointer-events-none whitespace-nowrap z-10
      ">
        <div className="font-semibold">{achievement.title}</div>
        <div className="text-xs text-gray-300">{achievement.description}</div>
        {!isUnlocked && (
          <div className="text-xs text-blue-300 mt-1">
            Progress: {progress}/{requirement}
          </div>
        )}
        <div className="text-xs text-yellow-300">
          {achievement.points} points
        </div>
        
        {/* Tooltip Arrow */}
        <div className="
          absolute top-full left-1/2 transform -translate-x-1/2
          border-4 border-transparent border-t-gray-800
        " />
      </div>
    </div>
  )
}
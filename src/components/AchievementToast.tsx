'use client'

import React, { useEffect, useState } from 'react'
import { Achievement } from './AchievementBadge'

interface AchievementToastProps {
  achievement: Achievement | null
  onClose: () => void
  duration?: number
}

export default function AchievementToast({ 
  achievement, 
  onClose, 
  duration = 5000 
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      setIsExiting(false)
      
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [achievement, duration, handleClose])

  if (!achievement || !isVisible) return null

  const rarityColors = {
    bronze: 'from-amber-400 to-amber-600',
    silver: 'from-gray-400 to-gray-600', 
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-purple-600'
  }

  const rarityBorder = {
    bronze: 'border-amber-400',
    silver: 'border-gray-400',
    gold: 'border-yellow-400', 
    platinum: 'border-purple-400'
  }

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div 
        className={`
          bg-white border-2 ${rarityBorder[achievement.rarity]} 
          rounded-xl shadow-2xl p-6 max-w-sm
          transform transition-all duration-300 pointer-events-auto
          ${isExiting 
            ? 'translate-x-full opacity-0' 
            : 'translate-x-0 opacity-100'
          }
        `}
      >
        {/* Header with celebration effect */}
        <div className="relative overflow-hidden">
          <div className={`
            absolute inset-0 bg-gradient-to-r ${rarityColors[achievement.rarity]} 
            opacity-10 rounded-lg
          `} />
          
          <div className="relative flex items-center gap-3 mb-3">
            <div className={`
              w-12 h-12 rounded-full bg-gradient-to-br ${rarityColors[achievement.rarity]}
              flex items-center justify-center text-white text-xl
              shadow-lg animate-pulse
            `}>
              {achievement.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-lg">
                  Achievement Unlocked!
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)} Achievement
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Details */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 text-xl">
            {achievement.title}
          </h4>
          <p className="text-gray-600 text-sm">
            {achievement.description}
          </p>
        </div>

        {/* Points and Rarity */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {achievement.rarity === 'bronze' && '🥉'}
              {achievement.rarity === 'silver' && '🥈'} 
              {achievement.rarity === 'gold' && '🥇'}
              {achievement.rarity === 'platinum' && '💎'}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {achievement.rarity.toUpperCase()}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              +{achievement.points}
            </div>
            <div className="text-xs text-gray-500">
              points earned
            </div>
          </div>
        </div>

        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 bg-gradient-to-br ${rarityColors[achievement.rarity]}
                rounded-full opacity-80 animate-bounce
              `}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Progress bar animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]} transition-all duration-[${duration}ms] ease-linear`}
            style={{ 
              width: isExiting ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  )
}
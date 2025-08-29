'use client'

import React, { useState, useCallback } from 'react'
import { Volume2, VolumeX, Loader2, Globe, Settings, Zap } from 'lucide-react'
import { HybridAudioService } from '@/lib/hybrid-audio-service'
import { useAudioSettings } from '@/contexts/AudioSettingsContext'

interface PronunciationPlayerProps {
  text: string
  type?: 'word' | 'sentence'
  accent?: 'US' | 'UK' | 'AU'
  size?: 'small' | 'medium' | 'large'
  autoPlay?: boolean
  showAccentSelector?: boolean
  className?: string
  onPlay?: () => void
  onError?: (error: string) => void
}

const accentLabels = {
  US: { label: 'American', flag: '🇺🇸' },
  UK: { label: 'British', flag: '🇬🇧' },
  AU: { label: 'Australian', flag: '🇦🇺' }
}

export default function PronunciationPlayer({
  text,
  type = 'word',
  accent,
  size = 'medium',
  autoPlay,
  showAccentSelector = false,
  className = '',
  onPlay,
  onError
}: PronunciationPlayerProps) {
  const { settings } = useAudioSettings()
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAccent, setSelectedAccent] = useState<'US' | 'UK' | 'AU'>(accent || settings.preferredAccent)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string>('')
  const [audioSource, setAudioSource] = useState<'static' | 'tts' | 'cached' | null>(null)
  const [loadTime, setLoadTime] = useState<number>(0)
  
  // Use settings values with props as fallbacks
  const effectiveAutoPlay = autoPlay !== undefined ? autoPlay : settings.autoPlay

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-10 h-10'
  }

  const buttonSizes = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3'
  }

  const handlePlay = useCallback(async () => {
    if (isPlaying || isLoading) return

    try {
      setIsLoading(true)
      setError('')
      setIsPlaying(true)
      
      // Use hybrid audio service
      const result = await HybridAudioService.playAudio({
        word: text,
        accent: selectedAccent,
        type,
        volume: settings.volume,
        playbackRate: settings.playbackSpeed
      })
      
      if (!result.success) {
        throw new Error(result.error || 'Audio playback failed')
      }
      
      // Store audio source info and load time
      setAudioSource(result.audioSource.type)
      setLoadTime(result.loadTime || 0)
      
      onPlay?.()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Audio playback failed'
      setError(errorMessage)
      onError?.(errorMessage)
      console.error('Pronunciation error:', error)
    } finally {
      setIsLoading(false)
      setIsPlaying(false)
    }
  }, [isPlaying, isLoading, text, selectedAccent, type, settings.volume, settings.playbackSpeed, onPlay, onError])

  React.useEffect(() => {
    if (effectiveAutoPlay && text) {
      handlePlay()
    }
  }, [text, effectiveAutoPlay, handlePlay])

  // Update selected accent when settings change
  React.useEffect(() => {
    if (!accent) {
      setSelectedAccent(settings.preferredAccent)
    }
  }, [settings.preferredAccent, accent])

  const handleAccentChange = (newAccent: 'US' | 'UK' | 'AU') => {
    setSelectedAccent(newAccent)
    setShowSettings(false)
  }

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* Main Play Button */}
      <button
        onClick={handlePlay}
        disabled={isLoading || isPlaying || !text}
        className={`
          ${buttonSizes[size]} ${sizeClasses[size]}
          bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
          text-white rounded-full transition-all duration-200
          flex items-center justify-center
          ${isPlaying ? 'animate-pulse' : ''}
          ${error ? 'bg-red-500 hover:bg-red-600' : ''}
        `}
        title={`Pronounce "${text}" in ${accentLabels[selectedAccent].label} accent`}
      >
        {isLoading ? (
          <Loader2 className={`${sizeClasses[size]} animate-spin`} />
        ) : error ? (
          <VolumeX className={sizeClasses[size]} />
        ) : (
          <Volume2 className={sizeClasses[size]} />
        )}
      </button>

      {/* Accent Info & Audio Source */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 font-medium">
          {accentLabels[selectedAccent].flag}
        </span>
        
        {/* Audio source indicator */}
        {audioSource && (
          <div className="flex items-center gap-1" title={`Audio source: ${audioSource} (${loadTime}ms)`}>
            {audioSource === 'static' && (
              <Zap className="w-3 h-3 text-green-500" />
            )}
            {audioSource === 'tts' && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
            {audioSource === 'cached' && (
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
            )}
          </div>
        )}
      </div>

      {/* Settings Button */}
      {showAccentSelector && (
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
          title="Change accent"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}

      {/* Accent Selector Dropdown */}
      {showSettings && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-36 max-w-48">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Accent
            </div>
            {Object.entries(accentLabels).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAccentChange(key as 'US' | 'UK' | 'AU')}
                className={`
                  w-full text-left px-3 py-2 text-sm rounded transition-colors touch-manipulation
                  flex items-center gap-2
                  ${selectedAccent === key 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100'
                  }
                `}
              >
                <span>{value.flag}</span>
                <span>{value.label}</span>
                {selectedAccent === key && (
                  <span className="ml-auto text-blue-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-0 mt-1 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 whitespace-nowrap z-10">
          {error}
        </div>
      )}

      {/* Performance info */}
      {loadTime > 0 && (
        <div className="text-xs text-gray-400 opacity-70" title={`Load time: ${loadTime}ms`}>
          {loadTime}ms
        </div>
      )}
    </div>
  )
}
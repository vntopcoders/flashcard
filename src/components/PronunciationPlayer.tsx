'use client'

import React, { useState, useRef } from 'react'
import { Volume2, VolumeX, Loader2, Globe, Settings } from 'lucide-react'
import { GoogleTTSService } from '@/lib/google-tts'

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
  accent = 'US',
  size = 'medium',
  autoPlay = false,
  showAccentSelector = false,
  className = '',
  onPlay,
  onError
}: PronunciationPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAccent, setSelectedAccent] = useState<'US' | 'UK' | 'AU'>(accent)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string>('')
  const [audioCache, setAudioCache] = useState<Map<string, string>>(new Map())
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  React.useEffect(() => {
    if (autoPlay && text) {
      handlePlay()
    }
  }, [text, autoPlay])

  const getCacheKey = (text: string, accent: string) => `${text}-${accent}`

  const handlePlay = async () => {
    if (isPlaying || isLoading) return

    try {
      setIsLoading(true)
      setError('')
      
      const cacheKey = getCacheKey(text, selectedAccent)
      let audioContent = audioCache.get(cacheKey)
      
      if (!audioContent) {
        // Generate new audio
        const response = type === 'word' 
          ? await GoogleTTSService.pronounceWord(text, selectedAccent)
          : await GoogleTTSService.pronounceSentence(text, selectedAccent)
        
        if (response.error) {
          throw new Error(response.error)
        }
        
        if (!response.audioContent) {
          throw new Error('No audio content received')
        }
        
        audioContent = response.audioContent
        
        // Cache the audio
        if (audioContent) {
          setAudioCache(prev => new Map(prev).set(cacheKey, audioContent as string))
        }
      }

      // Play the audio
      setIsPlaying(true)
      await GoogleTTSService.playAudio(audioContent)
      
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
  }

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

      {/* Accent Info */}
      <span className="text-xs text-gray-500 font-medium">
        {accentLabels[selectedAccent].flag}
      </span>

      {/* Settings Button */}
      {showAccentSelector && (
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Change accent"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}

      {/* Accent Selector Dropdown */}
      {showSettings && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-36">
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
                  w-full text-left px-2 py-1.5 text-sm rounded transition-colors
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

      {/* Loading indicator for cached audio */}
      {audioCache.size > 0 && (
        <div className="text-xs text-green-500 opacity-70" title="Audio cached">
          •
        </div>
      )}
    </div>
  )
}
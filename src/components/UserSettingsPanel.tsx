'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Volume2, 
  Download, 
  Trash2, 
  X, 
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react'
import { OfflineAudioCache } from '@/lib/offline-audio-cache'
import { HybridAudioService } from '@/lib/hybrid-audio-service'
import { useAudioSettings, AudioSettings } from '@/contexts/AudioSettingsContext'

interface UserSettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserSettingsPanel({ 
  isOpen, 
  onClose
}: UserSettingsPanelProps) {
  const { settings, updateSettings } = useAudioSettings()
  const [cacheStats, setCacheStats] = useState({
    totalItems: 0,
    sizeMB: 0,
    usagePercent: 0
  })
  const [isOnline, setIsOnline] = useState(true)
  const [preCacheProgress, setPreCacheProgress] = useState<{
    isRunning: boolean
    completed: number
    total: number
    currentWord?: string
  }>({ isRunning: false, completed: 0, total: 0 })

  useEffect(() => {
    if (isOpen) {
      loadCacheStats()
      checkOnlineStatus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadCacheStats = async () => {
    try {
      const stats = await OfflineAudioCache.getCacheStats()
      setCacheStats(stats)
    } catch (error) {
      console.error('Failed to load cache stats:', error)
    }
  }

  const checkOnlineStatus = () => {
    setIsOnline(navigator.onLine)
  }

  const handleSettingChange = (key: keyof AudioSettings, value: AudioSettings[keyof AudioSettings]) => {
    updateSettings({ [key]: value })
  }

  const clearCache = async () => {
    try {
      const success = await HybridAudioService.clearCache()
      if (success) {
        await loadCacheStats()
        setAudioSource(null) // Reset audio source indicators
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  const setAudioSource = (source: 'static' | 'tts' | 'cached' | null) => {
    // This function is just to avoid TypeScript errors
    // In a real app, you might want to notify PronunciationPlayer components
    console.log('Audio source cleared:', source)
  }

  const startPreCache = async () => {
    try {
      setPreCacheProgress({ isRunning: true, completed: 0, total: 0 })
      
      // Sample vocabulary words for pre-caching
      const commonWords = [
        'hello', 'world', 'study', 'learn', 'practice', 'vocabulary', 'english',
        'pronunciation', 'accent', 'language', 'speaking', 'listening', 'reading',
        'writing', 'grammar', 'sentence', 'word', 'meaning', 'definition', 'example',
        'education', 'student', 'teacher', 'lesson', 'course', 'exam', 'test',
        'knowledge', 'skill', 'ability', 'improvement', 'progress', 'achievement',
        'success', 'failure', 'difficulty', 'challenge', 'opportunity', 'experience',
        'communication', 'conversation', 'discussion', 'presentation', 'interview'
      ]
      
      setPreCacheProgress(prev => ({ ...prev, total: commonWords.length }))
      
      // Use hybrid audio service for pre-caching
      const result = await HybridAudioService.preCacheWords(
        commonWords,
        settings.preferredAccent,
        (completed, total, currentWord) => {
          setPreCacheProgress({ 
            isRunning: true, 
            completed, 
            total,
            currentWord 
          })
        }
      )
      
      setPreCacheProgress({ 
        isRunning: false, 
        completed: result.cached, 
        total: commonWords.length 
      })
      
      await loadCacheStats()
      
      if (result.failed.length > 0) {
        console.warn(`Failed to cache ${result.failed.length} words:`, result.failed)
      }
      
    } catch (error) {
      console.error('Pre-cache failed:', error)
      setPreCacheProgress({ isRunning: false, completed: 0, total: 0 })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <h2 className="text-xl font-bold">Audio Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          
          {/* Online Status */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">Online - Full features available</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Offline - Using cached audio only</span>
              </>
            )}
          </div>

          {/* Voice Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Voice Preferences
            </h3>

            {/* Preferred Accent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Accent
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'US', label: 'American', flag: '🇺🇸' },
                  { key: 'UK', label: 'British', flag: '🇬🇧' },
                  { key: 'AU', label: 'Australian', flag: '🇦🇺' }
                ].map(({ key, label, flag }) => (
                  <button
                    key={key}
                    onClick={() => handleSettingChange('preferredAccent', key as 'US' | 'UK' | 'AU')}
                    className={`p-3 rounded-lg border transition-colors ${
                      settings.preferredAccent === key
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{flag}</div>
                      <div className="text-sm font-medium">{label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto Play</label>
                <p className="text-xs text-gray-500">Automatically play audio when showing flashcards</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoPlay', !settings.autoPlay)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoPlay ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoPlay ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Playback Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Playback Speed: {settings.playbackSpeed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.playbackSpeed}
                onChange={(e) => handleSettingChange('playbackSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {Math.round(settings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Offline Cache */}
          {OfflineAudioCache.isSupported() && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Offline Cache
              </h3>

              {/* Cache Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{cacheStats.totalItems}</div>
                    <div className="text-xs text-gray-500">Audio files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{cacheStats.sizeMB} MB</div>
                    <div className="text-xs text-gray-500">Storage used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{cacheStats.usagePercent}%</div>
                    <div className="text-xs text-gray-500">Cache full</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(cacheStats.usagePercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Enable Offline Cache */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Offline Cache</label>
                  <p className="text-xs text-gray-500">Cache audio files for offline use</p>
                </div>
                <button
                  onClick={() => handleSettingChange('enableOfflineCache', !settings.enableOfflineCache)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableOfflineCache ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableOfflineCache ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Pre-cache Common Words */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pre-cache Common Words</label>
                    <p className="text-xs text-gray-500">Download audio for common vocabulary</p>
                  </div>
                  <button
                    onClick={startPreCache}
                    disabled={preCacheProgress.isRunning || !isOnline}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    <Download className="w-4 h-4" />
                    {preCacheProgress.isRunning ? 'Downloading...' : 'Download'}
                  </button>
                </div>

                {/* Progress */}
                {preCacheProgress.isRunning && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>
                        Progress: {preCacheProgress.completed}/{preCacheProgress.total}
                        {preCacheProgress.currentWord && (
                          <span className="text-blue-600 font-medium"> - {preCacheProgress.currentWord}</span>
                        )}
                      </span>
                      <span>{Math.round((preCacheProgress.completed / preCacheProgress.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(preCacheProgress.completed / preCacheProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Cache */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-700">Clear Cache</label>
                  <p className="text-xs text-gray-500">Remove all cached audio files</p>
                </div>
                <button
                  onClick={clearCache}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Settings are saved automatically
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AudioSettings {
  preferredAccent: 'US' | 'UK' | 'AU'
  autoPlay: boolean
  playbackSpeed: number
  volume: number
  enableOfflineCache: boolean
  autoDownload: boolean
  maxCacheSize: number
}

interface AudioSettingsContextType {
  settings: AudioSettings
  updateSettings: (newSettings: Partial<AudioSettings>) => void
}

const defaultSettings: AudioSettings = {
  preferredAccent: 'US',
  autoPlay: false,
  playbackSpeed: 1.0,
  volume: 0.8,
  enableOfflineCache: true,
  autoDownload: false,
  maxCacheSize: 50
}

const AudioSettingsContext = createContext<AudioSettingsContextType | undefined>(undefined)

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(defaultSettings)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('ielts-audio-settings')
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsedSettings })
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error)
    }
  }

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    
    try {
      localStorage.setItem('ielts-audio-settings', JSON.stringify(updatedSettings))
    } catch (error) {
      console.error('Failed to save audio settings:', error)
    }
  }

  return (
    <AudioSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AudioSettingsContext.Provider>
  )
}

export function useAudioSettings() {
  const context = useContext(AudioSettingsContext)
  if (context === undefined) {
    throw new Error('useAudioSettings must be used within an AudioSettingsProvider')
  }
  return context
}
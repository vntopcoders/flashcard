'use client'

import React, { useState, useEffect } from 'react'
import { 
  User, 
  Target, 
  Clock, 
  Trophy, 
  Settings,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface UserProfile {
  id: string
  name?: string
  email?: string
  image?: string
  created_at: string
  current_level: 'beginner' | 'intermediate' | 'advanced'
  target_band_score: number
  study_streak: number
  total_study_time: number
  preferred_study_time: 'morning' | 'afternoon' | 'evening'
  timezone: string
}

interface UserPreferences {
  preferred_accent: 'US' | 'UK' | 'AU'
  auto_play: boolean
  playback_speed: number
  volume: number
  enable_offline_cache: boolean
  daily_word_target: number
  reminder_enabled: boolean
  reminder_time: string
  show_ipa: boolean
  dark_mode: boolean
  language_interface: 'en' | 'vi'
}

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data = await response.json()
      setProfile(data.user)
      setPreferences(data.preferences)
    } catch {
      setMessage({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: profile,
          preferences: preferences
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      const data = await response.json()
      setProfile(data.user)
      setPreferences(data.preferences)
      setMessage({ type: 'success', text: 'Profile saved successfully!' })
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)

    } catch {
      setMessage({ type: 'error', text: 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: keyof UserProfile, value: string | number) => {
    if (profile) {
      setProfile({ ...profile, [field]: value })
    }
  }

  const updatePreferences = (field: keyof UserPreferences, value: string | number | boolean) => {
    if (preferences) {
      setPreferences({ ...preferences, [field]: value })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Please sign in to access your profile
        </h2>
        <p className="text-gray-600">
          Sign in to manage your learning preferences and track progress.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    )
  }

  if (!profile || !preferences) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Failed to load profile
        </h2>
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">{profile.target_band_score}</div>
            <div className="text-xs text-blue-600">Target Band</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Trophy className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">{profile.study_streak}</div>
            <div className="text-xs text-green-600">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600">{Math.round(profile.total_study_time / 60)}h</div>
            <div className="text-xs text-purple-600">Study Time</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <Globe className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-600 capitalize">{profile.current_level}</div>
            <div className="text-xs text-yellow-600">Current Level</div>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Learning Goals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Learning Goals
          </h2>

          <div className="space-y-4">
            {/* Current Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Level
              </label>
              <select
                value={profile.current_level}
                onChange={(e) => updateProfile('current_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner (4.0-5.0)</option>
                <option value="intermediate">Intermediate (5.5-6.5)</option>
                <option value="advanced">Advanced (7.0+)</option>
              </select>
            </div>

            {/* Target Band Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target IELTS Band Score: {profile.target_band_score}
              </label>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={profile.target_band_score}
                onChange={(e) => updateProfile('target_band_score', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4.0</span>
                <span>6.5</span>
                <span>9.0</span>
              </div>
            </div>

            {/* Daily Word Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Word Target: {preferences.daily_word_target} words
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={preferences.daily_word_target}
                onChange={(e) => updatePreferences('daily_word_target', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* Preferred Study Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Study Time
              </label>
              <select
                value={profile.preferred_study_time}
                onChange={(e) => updateProfile('preferred_study_time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="morning">Morning (6AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 6PM)</option>
                <option value="evening">Evening (6PM - 12AM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Study Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Study Preferences
          </h2>

          <div className="space-y-4">
            {/* Language Interface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interface Language
              </label>
              <select
                value={preferences.language_interface}
                onChange={(e) => updatePreferences('language_interface', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Show IPA */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Show IPA Pronunciation</label>
                <p className="text-xs text-gray-500">Display phonetic transcription for words</p>
              </div>
              <button
                onClick={() => updatePreferences('show_ipa', !preferences.show_ipa)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.show_ipa ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.show_ipa ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                <p className="text-xs text-gray-500">Enable dark theme interface</p>
              </div>
              <button
                onClick={() => updatePreferences('dark_mode', !preferences.dark_mode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.dark_mode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.dark_mode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reminder Settings */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Study Reminders</label>
                <p className="text-xs text-gray-500">Get daily study reminders</p>
              </div>
              <button
                onClick={() => updatePreferences('reminder_enabled', !preferences.reminder_enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.reminder_enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.reminder_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reminder Time */}
            {preferences.reminder_enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={preferences.reminder_time}
                  onChange={(e) => updatePreferences('reminder_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button & Status */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {message && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message.text}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
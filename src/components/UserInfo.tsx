'use client'

import { useState, useEffect } from 'react'
import { User, RefreshCw, Settings } from 'lucide-react'
import { getCurrentUserId, getUserDisplayName, setUserId, resetUserId } from '@/lib/user-utils'

export default function UserInfo() {
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [showSettings, setShowSettings] = useState(false)
  const [customUserId, setCustomUserId] = useState('')

  useEffect(() => {
    const userId = getCurrentUserId()
    setCurrentUserId(userId)
    setCustomUserId(userId)
  }, [])

  const handleSetCustomUser = () => {
    if (customUserId.trim()) {
      setUserId(customUserId.trim())
      setCurrentUserId(customUserId.trim())
      setShowSettings(false)
      // Reload page to reinitialize with new user
      window.location.reload()
    }
  }

  const handleResetUser = () => {
    resetUserId()
    const newUserId = getCurrentUserId()
    setCurrentUserId(newUserId)
    setCustomUserId(newUserId)
    setShowSettings(false)
    // Reload page to reinitialize with new user
    window.location.reload()
  }

  const displayName = getUserDisplayName(currentUserId)

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
        <User className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700 font-medium">{displayName}</span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          title="User Settings"
        >
          <Settings className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      {showSettings && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
          <h3 className="font-medium text-gray-900 mb-3">User Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Current User ID
              </label>
              <div className="text-sm font-mono bg-gray-50 px-2 py-1 rounded border">
                {currentUserId}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Set Custom User ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUserId}
                  onChange={(e) => setCustomUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSetCustomUser}
                  disabled={!customUserId.trim()}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={handleResetUser}
                className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
              >
                <RefreshCw className="w-4 h-4" />
                Generate New User ID
              </button>
            </div>

            <div className="text-xs text-gray-500">
              <strong>Note:</strong> Changing user ID will reload the page and initialize progress for the new user.
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
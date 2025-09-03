'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle, AlertCircle, User, BookOpen, Calendar } from 'lucide-react'

export default function SyncProgressPage() {
  const [userId, setUserId] = useState('demo-user')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data: {
      user_id: string
      synced_lessons: number
      total_words_learned: number
      current_day: number
      current_week: number
      current_phase: string
      user_progress: unknown
    }
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<{
    user_progress: {
      total_days_studied: number
      total_words_learned: number
      current_day: number
      current_week: number
      current_phase: string
    } | null
    completed_lessons_count: number
    total_words_from_lessons: number
    needs_sync: boolean
  } | null>(null)

  const checkSyncStatus = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/user/sync-progress?user_id=${encodeURIComponent(userId)}`)
      const data = await response.json()
      
      if (data.success) {
        setSyncStatus(data.data)
      } else {
        setError(data.error || 'Failed to check sync status')
      }
    } catch (err) {
      setError('Network error checking sync status')
      console.error('Error checking sync status:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const syncProgress = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResult(null)
      
      const response = await fetch('/api/user/sync-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResult(data)
        // Refresh sync status after successful sync
        setTimeout(checkSyncStatus, 500)
      } else {
        setError(data.error || 'Sync failed')
      }
    } catch (err) {
      setError('Network error during sync')
      console.error('Error syncing progress:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sync User Progress</h1>
              <p className="text-gray-600">Đồng bộ tiến độ từ daily_lesson_progress sang user_progress</p>
            </div>
          </div>

          {/* User Input */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              User ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID (e.g., demo-user)"
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={checkSyncStatus}
                disabled={isLoading || !userId.trim()}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Check Status
              </button>
            </div>
          </div>

          {/* Sync Status Display */}
          {syncStatus && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Current Status for: {userId}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">User Progress Table</h4>
                  {syncStatus.user_progress ? (
                    <div className="space-y-1 text-sm">
                      <div>Days Studied: <span className="font-mono">{syncStatus.user_progress.total_days_studied}</span></div>
                      <div>Words Learned: <span className="font-mono">{syncStatus.user_progress.total_words_learned}</span></div>
                      <div>Current Day: <span className="font-mono">{syncStatus.user_progress.current_day}</span></div>
                      <div>Current Week: <span className="font-mono">{syncStatus.user_progress.current_week}</span></div>
                      <div>Phase: <span className="font-mono">{syncStatus.user_progress.current_phase}</span></div>
                    </div>
                  ) : (
                    <div className="text-orange-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      No user_progress record found
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">Completed Lessons</h4>
                  <div className="space-y-1 text-sm">
                    <div>Completed Days: <span className="font-mono">{syncStatus.completed_lessons_count}</span></div>
                    <div>Total Words: <span className="font-mono">{syncStatus.total_words_from_lessons}</span></div>
                  </div>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                syncStatus.needs_sync 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {syncStatus.needs_sync ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Sync Required</span> - Dữ liệu không khớp giữa hai bảng
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">In Sync</span> - Dữ liệu đã đồng bộ
                  </>
                )}
              </div>
            </div>
          )}

          {/* Sync Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={syncProgress}
              disabled={isLoading || !userId.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Sync Progress
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Success Result */}
          {result && result.success && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Sync Successful!</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Days</span>
                  </div>
                  <div>Synced: <span className="font-mono text-lg">{result.data.synced_lessons}</span></div>
                  <div>Current Day: <span className="font-mono">{result.data.current_day}</span></div>
                  <div>Current Week: <span className="font-mono">{result.data.current_week}</span></div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Words</span>
                  </div>
                  <div>Total Learned: <span className="font-mono text-lg">{result.data.total_words_learned}</span></div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Phase</span>
                  </div>
                  <div>Current: <span className="font-mono text-lg">{result.data.current_phase}</span></div>
                </div>
              </div>

              <p className="text-green-700 mt-3">{result.message}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-blue-900 mb-2">Hướng dẫn sử dụng:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
              <li>Nhập User ID cần đồng bộ (ví dụ: demo-user)</li>
              <li>Click &quot;Check Status&quot; để xem trạng thái hiện tại</li>
              <li>Nếu cần sync, click &quot;Sync Progress&quot; để đồng bộ dữ liệu</li>
              <li>Hệ thống sẽ tính toán lại tiến độ từ daily_lesson_progress</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
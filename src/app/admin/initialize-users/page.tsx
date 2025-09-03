'use client'

import { useState } from 'react'
import { UserPlus, Play, CheckCircle, AlertCircle, Users } from 'lucide-react'

export default function InitializeUsersPage() {
  const [userIds, setUserIds] = useState('demo-user\nuser-1\nuser-2')
  const [isInitializing, setIsInitializing] = useState(false)
  const [results, setResults] = useState<{
    user_id: string
    success: boolean
    message: string
    is_new_user?: boolean
    error?: string
  }[]>([])
  const [error, setError] = useState<string | null>(null)

  const initializeUsers = async () => {
    try {
      setIsInitializing(true)
      setError(null)
      setResults([])
      
      const userIdList = userIds.split('\n').map(id => id.trim()).filter(id => id.length > 0)
      
      if (userIdList.length === 0) {
        setError('Please enter at least one user ID')
        return
      }

      console.log('🚀 Initializing users:', userIdList)
      
      const initResults = []
      
      for (const userId of userIdList) {
        try {
          const response = await fetch('/api/user/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
          })
          
          const data = await response.json()
          initResults.push({
            user_id: userId,
            success: data.success,
            message: data.message,
            is_new_user: data.data?.is_new_user,
            error: data.error
          })
        } catch {
          initResults.push({
            user_id: userId,
            success: false,
            error: 'Network error',
            message: 'Failed to initialize user'
          })
        }
      }
      
      setResults(initResults)
      
    } catch (err) {
      setError('Unexpected error during initialization')
      console.error('Error initializing users:', err)
    } finally {
      setIsInitializing(false)
    }
  }

  const successCount = results.filter(r => r.success).length
  const errorCount = results.filter(r => !r.success).length
  const newUserCount = results.filter(r => r.success && r.is_new_user).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Initialize Users</h1>
              <p className="text-gray-600">Tạo bản ghi user_progress cho người dùng mới</p>
            </div>
          </div>

          {/* User IDs Input */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              User IDs (một user ID mỗi dòng)
            </label>
            <textarea
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
              placeholder="demo-user&#10;user-1&#10;user-2"
              rows={6}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <div className="text-xs text-blue-600 mt-1">
              Nhập các user ID cần initialize, mỗi ID một dòng
            </div>
          </div>

          {/* Initialize Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={initializeUsers}
              disabled={isInitializing || !userIds.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isInitializing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Initializing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Initialize Users
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Initialization Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{newUserCount}</div>
                  <div className="text-sm text-gray-600">New Users</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          {results.length > 0 && (
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-900">Detailed Results</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className={`px-4 py-3 border-b last:border-b-0 ${
                    result.success ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-mono text-sm font-medium">
                          {result.user_id}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.success ? 'Success' : 'Failed'}
                        </div>
                        {result.is_new_user && (
                          <div className="text-xs text-blue-600">New User</div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`text-sm mt-1 ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message || result.error}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-blue-900 mb-2">Khi nào cần initialize user?</h3>
            <div className="text-blue-800 space-y-2 text-sm">
              <div><strong>Tự động:</strong> Khi user truy cập daily lesson lần đầu, hệ thống sẽ tự động tạo user_progress</div>
              <div><strong>Thủ công:</strong> Sử dụng trang này để bulk initialize nhiều user cùng lúc</div>
              <div><strong>Data flow:</strong></div>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>User_progress được tạo (tự động hoặc thủ công)</li>
                <li>Khi user click &quot;Complete Day X&quot; → tạo daily_lesson_progress</li>
                <li>API tự động cập nhật lại user_progress với tiến độ mới</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
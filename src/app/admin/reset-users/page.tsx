'use client'

import { useState } from 'react'
import { Users, RotateCcw, CheckCircle, AlertTriangle, Calendar, Target } from 'lucide-react'

export default function ResetUsersPage() {
  const [isResetting, setIsResetting] = useState(false)
  const [resetResult, setResetResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResetAllUsers = async () => {
    try {
      setIsResetting(true)
      setError(null)
      setResetResult(null)

      console.log('🔄 Starting global user reset...')

      const response = await fetch('/api/user-progress/reset-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (result.success) {
        setResetResult(result)
        console.log('✅ Reset successful:', result)
      } else {
        setError(result.error || 'Reset failed')
        console.error('❌ Reset failed:', result)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('❌ Unexpected error:', err)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              👨‍💼 Admin: User Progress Management
            </h1>
          </div>
          <p className="text-gray-600">
            Reset all users back to Day 1, Week 1 of the 36-week IELTS study plan
          </p>
        </div>

        {/* Reset Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Global User Progress Reset
              </h2>
              <p className="text-gray-600 mb-4">
                This will reset ALL users in the database to:
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Week 1, Day 1</div>
                      <div className="text-sm text-blue-700">Start position</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Foundation Phase</div>
                      <div className="text-sm text-blue-700">Beginning level</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Clean Slate</div>
                      <div className="text-sm text-blue-700">Fresh start</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetAllUsers}
                  disabled={isResetting}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    isResetting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isResetting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Reset All Users
                    </>
                  )}
                </button>
                
                {!isResetting && (
                  <div className="text-sm text-gray-500">
                    ⚠️ This action cannot be undone
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Result */}
        {resetResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  ✅ Reset Successful!
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {resetResult.affected_users}
                    </div>
                    <div className="text-sm text-gray-600">Users Reset</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-medium text-green-600 mb-1">
                      Week {resetResult.reset_to?.week}, Day {resetResult.reset_to?.day}
                    </div>
                    <div className="text-sm text-gray-600">{resetResult.reset_to?.phase} Phase</div>
                  </div>
                </div>
                
                <div className="text-sm text-green-700">
                  <strong>Message:</strong> {resetResult.message}
                </div>
                
                <div className="text-xs text-green-600 mt-2">
                  Reset completed at: {new Date(resetResult.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Result */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  ❌ Reset Failed
                </h3>
                <div className="text-red-700 mb-2">
                  <strong>Error:</strong> {error}
                </div>
                <div className="text-sm text-red-600">
                  Please check the server logs for more details or try again.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">💡</div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">
                About User Progress Reset
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  • Resets all users to <strong>Week 1, Day 1</strong> of the Foundation phase
                </p>
                <p>
                  • Clears daily lesson completion status
                </p>
                <p>
                  • Updates last study date to current time
                </p>
                <p>
                  • Creates user_progress table if it doesn't exist
                </p>
                <p>
                  • Maintains user accounts and authentication data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
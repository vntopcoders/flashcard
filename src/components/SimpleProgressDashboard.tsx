'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Target, 
  Clock,
  Brain,
  BookOpen,
  CheckCircle,
  Flame,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { getCurrentUserId } from '@/lib/user-utils'
import Link from 'next/link'

interface SimpleProgressData {
  totalDaysStudied: number
  totalWordsLearned: number
  currentWeek: number
  currentDay: number
  currentPhase: string
  completedLessons: number
  weeklyProgress: Array<{
    week: number
    days_completed: number
    words_learned: number
  }>
}

export default function SimpleProgressDashboard() {
  const [progressData, setProgressData] = useState<SimpleProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userId = getCurrentUserId()
      
      // Fetch user progress
      const userResponse = await fetch(`/api/user/sync-progress?user_id=${userId}`)
      let userData = null
      if (userResponse.ok) {
        const userResult = await userResponse.json()
        userData = userResult.data
      }
      
      // Fetch completed lessons
      const completedResponse = await fetch(`/api/daily-lesson/completed?user_id=${userId}`)
      let completedData = null
      if (completedResponse.ok) {
        const completedResult = await completedResponse.json()
        completedData = completedResult.data
      }
      
      // Process data
      const progress: SimpleProgressData = {
        totalDaysStudied: userData?.user_progress?.total_days_studied || 0,
        totalWordsLearned: userData?.user_progress?.total_words_learned || 0,
        currentWeek: userData?.user_progress?.current_week || 1,
        currentDay: userData?.user_progress?.current_day || 1,
        currentPhase: userData?.user_progress?.current_phase || 'Foundation',
        completedLessons: completedData?.completed_days?.length || 0,
        weeklyProgress: generateWeeklyProgress(completedData?.completed_days || [])
      }
      
      setProgressData(progress)
      
    } catch (err) {
      console.error('Error loading progress:', err)
      setError('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyProgress = (completedDays: number[]) => {
    const weeklyData: { [key: number]: { days_completed: number, words_learned: number } } = {}
    
    completedDays.forEach(day => {
      const week = Math.ceil(day / 7)
      if (!weeklyData[week]) {
        weeklyData[week] = { days_completed: 0, words_learned: 0 }
      }
      weeklyData[week].days_completed++
      weeklyData[week].words_learned += 20 // Assuming 20 words per day
    })
    
    return Object.entries(weeklyData).map(([week, data]) => ({
      week: parseInt(week),
      days_completed: data.days_completed,
      words_learned: data.words_learned
    })).sort((a, b) => a.week - b.week)
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Foundation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Development': return 'bg-green-100 text-green-800 border-green-200'
      case 'Mastery': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Expert': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Progress</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={loadProgressData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!progressData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Progress Dashboard
          </h1>
          <p className="text-gray-600">
            Track your IELTS vocabulary learning journey
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Studied</p>
                <p className="text-2xl font-bold text-gray-900">{progressData.totalDaysStudied}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Words Learned</p>
                <p className="text-2xl font-bold text-gray-900">{progressData.totalWordsLearned}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Week</p>
                <p className="text-2xl font-bold text-gray-900">{progressData.currentWeek}/36</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((progressData.currentDay / 252) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Phase</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getPhaseColor(progressData.currentPhase)}`}>
                <Brain className="w-4 h-4" />
                {progressData.currentPhase} Phase
              </div>
              <p className="text-gray-600 mt-2">
                Day {progressData.currentDay} • Week {progressData.currentWeek}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{progressData.completedLessons}</p>
              <p className="text-sm text-gray-600">Lessons Completed</p>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
          
          {progressData.weeklyProgress.length > 0 ? (
            <div className="space-y-4">
              {progressData.weeklyProgress.slice(-8).map((week) => (
                <div key={week.week} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Week {week.week}</p>
                      <p className="text-sm text-gray-600">
                        {week.days_completed}/7 days completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{week.words_learned} words</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(week.days_completed / 7) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No progress data yet</p>
              <p className="text-sm text-gray-500">Complete some daily lessons to see your progress</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/study-plan"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Target className="w-5 h-5" />
            View Study Plan
          </Link>
          <Link
            href="/?daily-lesson=1&phase=foundation"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            Continue Learning
          </Link>
        </div>
      </div>
    </div>
  )
}

function Play({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
    </svg>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Target, 
  Calendar, 
  TrendingUp, 
  Play, 
  RotateCcw,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Flame
} from 'lucide-react'
import { getCurrentUserId } from '@/lib/user-utils'
import UserInfo from './UserInfo'

interface DashboardData {
  userProgress: {
    current_day: number
    current_week: number
    current_phase: string
    total_days_studied: number
    total_words_learned: number
    study_streak: number
    target_score: number
    current_estimated_score: number
  } | null
  completedToday: boolean
  nextLessonDay: number
  recentActivity: Array<{
    day: number
    words_learned: number
    completion_date: string
  }>
  weeklyGoal: {
    target: number
    completed: number
  }
}

export default function HomeDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const userId = getCurrentUserId()
      
      // Fetch user progress
      const progressResponse = await fetch(`/api/user/sync-progress?user_id=${userId}`)
      let userProgress = null
      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        userProgress = progressData.data?.user_progress
      }
      
      // Fetch completed lessons
      const completedResponse = await fetch(`/api/daily-lesson/completed?user_id=${userId}`)
      let completedLessons: number[] = []
      let recentActivity: any[] = []
      if (completedResponse.ok) {
        const completedData = await completedResponse.json()
        completedLessons = completedData.data?.completed_days || []
        recentActivity = completedData.data?.completed_lessons?.slice(-5) || []
      }
      
      const today = new Date().toDateString()
      const completedToday = recentActivity.some(lesson => 
        new Date(lesson.completion_date).toDateString() === today
      )
      
      const nextLessonDay = userProgress?.current_day || 1
      const currentWeek = Math.ceil(nextLessonDay / 7)
      const weekStart = (currentWeek - 1) * 7 + 1
      const weekEnd = currentWeek * 7
      const thisWeekCompleted = completedLessons.filter(day => 
        day >= weekStart && day <= weekEnd
      ).length
      
      setData({
        userProgress,
        completedToday,
        nextLessonDay,
        recentActivity,
        weeklyGoal: {
          target: 7,
          completed: thisWeekCompleted
        }
      })
      
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setError('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'Foundation':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🏗️', description: 'Building basics' }
      case 'Development':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: '🌱', description: 'Growing skills' }
      case 'Mastery':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🎯', description: 'Mastering concepts' }
      case 'Expert':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '👑', description: 'Expert level' }
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '📚', description: 'Learning journey' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
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
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Dashboard</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={loadDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const phaseInfo = getPhaseInfo(data?.userProgress?.current_phase || '')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎯 IELTS Learning Hub
              </h1>
              <p className="text-gray-600">
                Your personalized journey to Band 8.0+
              </p>
            </div>
            <UserInfo />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Day</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.nextLessonDay || 1}
                </p>
                <p className="text-xs text-gray-500">of 252 days</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {data?.userProgress?.total_words_learned || 0}
                </p>
                <p className="text-xs text-gray-500">of 5,000 target</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.userProgress?.study_streak || 0}
                </p>
                <p className="text-xs text-gray-500">days in a row</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Target Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.userProgress?.target_score || 8.0}
                </p>
                <p className="text-xs text-gray-500">Current: {data?.userProgress?.current_estimated_score || 5.5}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Today's Focus */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📅 Today's Focus
              </h2>
              
              {data?.completedToday ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Great job! Today's lesson completed</p>
                      <p className="text-green-700 text-sm">You're on track with your learning goals</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Play className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Ready for Day {data?.nextLessonDay}</p>
                        <p className="text-blue-700 text-sm">20 new vocabulary words waiting</p>
                      </div>
                    </div>
                    <Link
                      href={`/?daily-lesson=${data?.nextLessonDay}&phase=${data?.userProgress?.current_phase?.toLowerCase() || 'foundation'}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Learning
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Current Phase */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🎯 Current Phase
              </h2>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{phaseInfo.icon}</div>
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${phaseInfo.color}`}>
                      {data?.userProgress?.current_phase || 'Foundation'} Phase
                    </div>
                    <p className="text-gray-600 mt-1">{phaseInfo.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Week {data?.userProgress?.current_week || 1} of 36
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(((data?.nextLessonDay || 1) / 252) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ⚡ Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/study-plan"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Study Plan</p>
                    <p className="text-sm text-gray-600">36-week roadmap</p>
                  </div>
                </Link>

                <Link
                  href="/review"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review</p>
                    <p className="text-sm text-gray-600">Practice learned words</p>
                  </div>
                </Link>

                <Link
                  href="/grammar"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Grammar</p>
                    <p className="text-sm text-gray-600">Practice exercises</p>
                  </div>
                </Link>

                <Link
                  href="/progress"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Progress</p>
                    <p className="text-sm text-gray-600">Track your journey</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Progress & Activity */}
          <div className="space-y-6">
            
            {/* Weekly Goal */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 This Week's Goal
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Days completed</span>
                  <span className="font-bold text-gray-900">
                    {data?.weeklyGoal.completed}/{data?.weeklyGoal.target}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((data?.weeklyGoal.completed || 0) / (data?.weeklyGoal.target || 1) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">
                  {data?.weeklyGoal.completed === data?.weeklyGoal.target ? 
                    "🎉 Week completed! Amazing work!" : 
                    `${(data?.weeklyGoal.target || 7) - (data?.weeklyGoal.completed || 0)} days left this week`
                  }
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📈 Recent Activity
              </h3>
              
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {data.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Day {activity.day} completed
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.completion_date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {activity.words_learned} words
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent activity</p>
                  <p className="text-gray-500 text-xs">Complete your first lesson to see progress</p>
                </div>
              )}
            </div>

            {/* Achievement Preview */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🏆 Next Milestone
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Complete 7 days to unlock "Week Champion" badge
              </p>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {data?.userProgress?.total_days_studied || 0}/7 days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
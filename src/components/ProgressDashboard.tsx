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
  RotateCcw
} from 'lucide-react'

interface DashboardData {
  overview: {
    total_cards: number
    cards_due_today: number
    cards_mastered: number
    current_streak: number
    study_time_today: number
    accuracy_rate: number
  }
  recent_sessions: Array<{
    date: string
    cards_studied: number
    accuracy: number
    duration_minutes: number
    session_type: string
  }>
  weekly_progress: Array<{
    date: string
    cards_reviewed: number
    new_cards_learned: number
    accuracy: number
  }>
  card_states: Array<{
    state: string
    count: number
  }>
  achievements: Array<{
    id: string
    name: string
    description: string
    progress: number
    target: number
    is_completed: boolean
    badge_icon: string
    badge_color: string
  }>
}

export default function ProgressDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate data since we don't have the backend tables yet
      // In production, this would fetch from /api/spaced-repetition/progress
      const mockData: DashboardData = {
        overview: {
          total_cards: 1987,
          cards_due_today: 45,
          cards_mastered: 234,
          current_streak: 7,
          study_time_today: 23,
          accuracy_rate: 87.5
        },
        recent_sessions: [
          { date: '2025-08-28', cards_studied: 25, accuracy: 88, duration_minutes: 18, session_type: 'mixed' },
          { date: '2025-08-27', cards_studied: 30, accuracy: 91, duration_minutes: 22, session_type: 'reviews' },
          { date: '2025-08-26', cards_studied: 20, accuracy: 85, duration_minutes: 15, session_type: 'new_cards' },
          { date: '2025-08-25', cards_studied: 35, accuracy: 89, duration_minutes: 25, session_type: 'mixed' },
          { date: '2025-08-24', cards_studied: 28, accuracy: 92, duration_minutes: 19, session_type: 'reviews' }
        ],
        weekly_progress: [
          { date: '2025-08-22', cards_reviewed: 32, new_cards_learned: 8, accuracy: 86 },
          { date: '2025-08-23', cards_reviewed: 28, new_cards_learned: 12, accuracy: 89 },
          { date: '2025-08-24', cards_reviewed: 35, new_cards_learned: 5, accuracy: 92 },
          { date: '2025-08-25', cards_reviewed: 30, new_cards_learned: 10, accuracy: 88 },
          { date: '2025-08-26', cards_reviewed: 25, new_cards_learned: 15, accuracy: 85 },
          { date: '2025-08-27', cards_reviewed: 40, new_cards_learned: 3, accuracy: 91 },
          { date: '2025-08-28', cards_reviewed: 25, new_cards_learned: 8, accuracy: 87 }
        ],
        card_states: [
          { state: 'new', count: 856 },
          { state: 'learning', count: 432 },
          { state: 'review', count: 465 },
          { state: 'mastered', count: 234 }
        ],
        achievements: [
          {
            id: '1',
            name: 'Learning Streak - 7 Days',
            description: 'Study for 7 consecutive days',
            progress: 7,
            target: 7,
            is_completed: true,
            badge_icon: '🔥',
            badge_color: 'orange'
          },
          {
            id: '2',
            name: 'First 100 Words',
            description: 'Master your first 100 vocabulary words',
            progress: 234,
            target: 100,
            is_completed: true,
            badge_icon: '📚',
            badge_color: 'blue'
          },
          {
            id: '3',
            name: 'Vocabulary Expert - 500 Words',
            description: 'Master 500 vocabulary words',
            progress: 234,
            target: 500,
            is_completed: false,
            badge_icon: '🎓',
            badge_color: 'purple'
          },
          {
            id: '4',
            name: 'Perfect Session - 10 Cards',
            description: 'Get 10 cards correct in a row',
            progress: 8,
            target: 10,
            is_completed: false,
            badge_icon: '⚡',
            badge_color: 'yellow'
          }
        ]
      }
      
      setDashboardData(mockData)
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCardStateColor = (state: string): string => {
    switch (state) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'learning': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-green-100 text-green-800'
      case 'mastered': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCardStateIcon = (state: string) => {
    switch (state) {
      case 'new': return <BookOpen className="w-4 h-4" />
      case 'learning': return <Brain className="w-4 h-4" />
      case 'review': return <RotateCcw className="w-4 h-4" />
      case 'mastered': return <CheckCircle className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getSessionTypeColor = (type: string): string => {
    switch (type) {
      case 'new_cards': return 'bg-blue-100 text-blue-800'
      case 'reviews': return 'bg-green-100 text-green-800'
      case 'mixed': return 'bg-purple-100 text-purple-800'
      case 'cram': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No data available
          </h2>
          <p className="text-gray-600">
            Start studying to see your progress dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Progress Dashboard
          </h1>
          <p className="text-gray-600">
            Track your vocabulary learning journey and achievements
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Total Cards</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {dashboardData.overview.total_cards.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Due Today</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {dashboardData.overview.cards_due_today}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Mastered</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {dashboardData.overview.cards_mastered}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Streak</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {dashboardData.overview.current_streak}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Study Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {dashboardData.overview.study_time_today}m
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {dashboardData.overview.accuracy_rate}%
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Weekly Progress
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="space-y-4">
            {dashboardData.weekly_progress.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-600">
                  {formatDate(day.date)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-medium text-gray-700">
                      {day.cards_reviewed + day.new_cards_learned} cards
                    </div>
                    <div className="text-xs text-green-600">
                      {day.accuracy}% accuracy
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div 
                      className="h-2 bg-blue-500 rounded"
                      style={{ 
                        width: `${(day.cards_reviewed / 50) * 100}%`,
                        minWidth: '2px'
                      }}
                    />
                    <div 
                      className="h-2 bg-green-500 rounded"
                      style={{ 
                        width: `${(day.new_cards_learned / 20) * 100}%`,
                        minWidth: '2px'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">New Cards</span>
            </div>
          </div>
        </div>

        {/* Card States */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Card Distribution
          </h3>
          
          <div className="space-y-4">
            {dashboardData.card_states.map((state) => (
              <div key={state.state} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded ${getCardStateColor(state.state)}`}>
                    {getCardStateIcon(state.state)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {state.state}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {state.count}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Learning Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(dashboardData.overview.cards_mastered / dashboardData.overview.total_cards) * 100}%`
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((dashboardData.overview.cards_mastered / dashboardData.overview.total_cards) * 100)}% mastered
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions & Achievements */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Recent Study Sessions
          </h3>
          
          <div className="space-y-4">
            {dashboardData.recent_sessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {formatDate(session.date)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSessionTypeColor(session.session_type)}`}>
                      {session.session_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {session.cards_studied} cards • {session.duration_minutes}m
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {session.accuracy}%
                  </div>
                  <div className="text-xs text-gray-500">accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Achievements
          </h3>
          
          <div className="space-y-4">
            {dashboardData.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl`}>
                  {achievement.badge_icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {achievement.name}
                    </span>
                    {achievement.is_completed && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {achievement.description}
                  </div>
                  {!achievement.is_completed && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className={`bg-${achievement.badge_color}-500 h-1.5 rounded-full transition-all duration-300`}
                          style={{ 
                            width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {achievement.progress} / {achievement.target}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
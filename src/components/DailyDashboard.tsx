'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Clock, 
  BookOpen,
  Brain,
  Edit3,
  Headphones,
  MessageSquare,
  Target,
  Flame,
  Play,
  TrendingUp,
  Award,
  LogIn,
  BarChart3
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'

interface DailyTask {
  id: string
  type: 'flashcard_review' | 'new_words' | 'grammar' | 'reading' | 'writing' | 'listening' | 'speaking'
  title: string
  description: string
  estimated_minutes: number
  priority: 'high' | 'medium' | 'low'
  is_completed: boolean
  target_count?: number
  current_count?: number
  due_date?: string
  skill_category: 'vocabulary' | 'grammar' | 'reading' | 'writing' | 'listening' | 'speaking'
}

interface DailyStats {
  cards_due: number
  new_cards_available: number
  study_streak: number
  minutes_studied_today: number
  accuracy_today: number
  tasks_completed: number
  total_tasks: number
  vocabulary_learned_today: number
  current_level: string
  target_score: number
}

export default function DailyDashboard() {
  const { user, isAuthenticated, loading: userLoading } = useCurrentUser()
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vocabulary' | 'grammar' | 'skills'>('all')

  useEffect(() => {
    if (!userLoading) {
      loadDailyData()
    }
  }, [user, userLoading])

  const loadDailyData = async () => {
    try {
      setIsLoading(true)
      
      if (!isAuthenticated || !user) {
        setDailyTasks([])
        setDailyStats(null)
        return
      }

      // Get spaced repetition data (using single-user service for now)
      const [studySchedule, progressData] = await Promise.all([
        SpacedRepetitionService.getStudySchedule().catch(() => null),
        SpacedRepetitionService.getLearningProgress().catch(() => null)
      ])

      // Generate daily tasks based on user's study plan and spaced repetition
      const tasks: DailyTask[] = [
        {
          id: 'flashcard-review',
          type: 'flashcard_review',
          title: 'Review Due Cards',
          description: `Review ${studySchedule?.dueToday || 0} flashcards that are due today`,
          estimated_minutes: Math.ceil((studySchedule?.dueToday || 0) * 0.8), // ~0.8 min per card
          priority: 'high',
          is_completed: (studySchedule?.dueToday || 0) === 0,
          target_count: studySchedule?.dueToday || 0,
          current_count: studySchedule?.reviewsCompleted || 0,
          skill_category: 'vocabulary'
        },
        {
          id: 'new-words',
          type: 'new_words',
          title: 'Learn New Words',
          description: `Study ${studySchedule?.newAvailable || 20} new vocabulary words`,
          estimated_minutes: (studySchedule?.newAvailable || 20) * 1.2, // ~1.2 min per new word
          priority: 'high',
          is_completed: false,
          target_count: studySchedule?.newAvailable || 20,
          current_count: 0,
          skill_category: 'vocabulary'
        },
        {
          id: 'grammar-morning',
          type: 'grammar',
          title: 'Morning Grammar Focus',
          description: 'Core grammar structures and usage patterns (40 minutes)',
          estimated_minutes: 40,
          priority: 'high',
          is_completed: false,
          target_count: 2,
          current_count: 0,
          skill_category: 'grammar'
        },
        {
          id: 'grammar-evening',
          type: 'grammar',
          title: 'Evening Grammar Practice',
          description: 'Applied grammar exercises and error correction (30 minutes)',
          estimated_minutes: 30,
          priority: 'medium',
          is_completed: false,
          target_count: 2,
          current_count: 0,
          skill_category: 'grammar'
        },
        {
          id: 'reading-practice',
          type: 'reading',
          title: 'IELTS Reading Practice',
          description: 'Practice reading comprehension with academic texts',
          estimated_minutes: 30,
          priority: 'medium',
          is_completed: false,
          skill_category: 'reading'
        },
        {
          id: 'writing-task',
          type: 'writing',
          title: 'Writing Task 1',
          description: 'Practice describing charts and graphs',
          estimated_minutes: 40,
          priority: 'medium',
          is_completed: false,
          skill_category: 'writing'
        },
        {
          id: 'listening-practice',
          type: 'listening',
          title: 'Listening Practice',
          description: 'IELTS listening exercises and note-taking',
          estimated_minutes: 20,
          priority: 'low',
          is_completed: false,
          skill_category: 'listening'
        },
        {
          id: 'speaking-practice',
          type: 'speaking',
          title: 'Speaking Practice',
          description: 'Part 1 topics: Personal information and familiar topics',
          estimated_minutes: 15,
          priority: 'low',
          is_completed: false,
          skill_category: 'speaking'
        }
      ]

      setDailyTasks(tasks)

      // Set daily stats
      const stats: DailyStats = {
        cards_due: studySchedule?.dueToday || 0,
        new_cards_available: studySchedule?.newAvailable || 0,
        study_streak: studySchedule?.streak || 0,
        minutes_studied_today: 0, // TODO: Get from user study sessions
        accuracy_today: studySchedule?.accuracy || 0,
        tasks_completed: tasks.filter(t => t.is_completed).length,
        total_tasks: tasks.length,
        vocabulary_learned_today: 0, // TODO: Get from today's completed reviews
        current_level: 'intermediate', // TODO: Get from user profile
        target_score: 7.0 // TODO: Get from user profile
      }

      setDailyStats(stats)
      
    } catch (error) {
      console.error('Failed to load daily data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'flashcard_review':
      case 'new_words': return <BookOpen className="w-4 h-4" />
      case 'grammar': return <Edit3 className="w-4 h-4" />
      case 'reading': return <BookOpen className="w-4 h-4" />
      case 'writing': return <Edit3 className="w-4 h-4" />
      case 'listening': return <Headphones className="w-4 h-4" />
      case 'speaking': return <MessageSquare className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getTaskAction = (task: DailyTask) => {
    switch (task.type) {
      case 'flashcard_review':
      case 'new_words':
        return '/review'
      case 'grammar':
        return '/grammar'
      default:
        return '/study-plan'
    }
  }

  const toggleTaskComplete = (taskId: string) => {
    setDailyTasks(tasks => tasks.map(task => 
      task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
    ))
  }

  const filteredTasks = dailyTasks.filter(task => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'vocabulary') return task.skill_category === 'vocabulary'
    if (selectedFilter === 'grammar') return task.skill_category === 'grammar'
    if (selectedFilter === 'skills') return ['reading', 'writing', 'listening', 'speaking'].includes(task.skill_category)
    return true
  })

  if (userLoading || isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to see your daily tasks
          </h2>
          <p className="text-gray-600 mb-6">
            Get a personalized daily dashboard with tasks, progress, and recommendations.
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const completedTasks = dailyTasks.filter(t => t.is_completed).length
  const totalMinutes = dailyTasks.reduce((sum, task) => sum + task.estimated_minutes, 0)
  const completionRate = dailyTasks.length > 0 ? (completedTasks / dailyTasks.length) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            📋 Daily Dashboard
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            {completedTasks} / {dailyTasks.length} completed
          </div>
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Due Today</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {dailyStats?.cards_due || 0}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">New Words</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {dailyStats?.new_cards_available || 0}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Streak</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {dailyStats?.study_streak || 0}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Study Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(totalMinutes)}m
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {dailyStats?.accuracy_today || 0}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Progress</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {Math.round(completionRate)}%
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter tasks:</span>
          {[
            { key: 'all', label: 'All Tasks' },
            { key: 'vocabulary', label: 'Vocabulary' },
            { key: 'grammar', label: 'Grammar' },
            { key: 'skills', label: '4 Skills' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as 'all' | 'vocabulary' | 'grammar' | 'skills')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Today&apos;s Tasks</h2>
        
        <div className="grid gap-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${getTaskColor(task.priority)} ${
                task.is_completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.is_completed
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.is_completed && <CheckCircle className="w-4 h-4" />}
                  </button>

                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    task.skill_category === 'vocabulary' ? 'text-blue-600 bg-blue-50' :
                    task.skill_category === 'grammar' ? 'text-green-600 bg-green-50' :
                    task.skill_category === 'reading' ? 'text-purple-600 bg-purple-50' :
                    task.skill_category === 'writing' ? 'text-orange-600 bg-orange-50' :
                    task.skill_category === 'listening' ? 'text-red-600 bg-red-50' :
                    task.skill_category === 'speaking' ? 'text-yellow-600 bg-yellow-50' :
                    'text-gray-600 bg-gray-50'
                  }`}>
                    {getTaskIcon(task.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    
                    {task.target_count && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <BarChart3 className="w-3 h-3" />
                        Progress: {task.current_count || 0} / {task.target_count}
                        <div className="w-16 bg-gray-200 rounded-full h-1 ml-2">
                          <div 
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${Math.min(((task.current_count || 0) / task.target_count) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="text-sm text-gray-500">
                    {task.estimated_minutes}min
                  </div>
                  <button
                    onClick={() => window.location.href = getTaskAction(task)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                      task.is_completed 
                        ? 'bg-gray-100 text-gray-500' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={task.is_completed}
                  >
                    <Play className="w-3 h-3" />
                    {task.is_completed ? 'Done' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Progress Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today&apos;s Progress</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Skill Focus</h4>
            <div className="space-y-2">
              {['vocabulary', 'grammar', 'reading', 'writing', 'listening', 'speaking'].map(skill => {
                const skillTasks = dailyTasks.filter(t => t.skill_category === skill)
                const completed = skillTasks.filter(t => t.is_completed).length
                const total = skillTasks.length
                const percentage = total > 0 ? (completed / total) * 100 : 0
                
                return (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{completed}/{total}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Recommendations</h4>
            <div className="space-y-2 text-sm">
              {dailyStats?.cards_due && dailyStats.cards_due > 30 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <TrendingUp className="w-4 h-4" />
                  Focus on reviewing due cards first
                </div>
              )}
              {completionRate < 25 && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Target className="w-4 h-4" />
                  Start with high-priority tasks
                </div>
              )}
              {completionRate >= 75 && (
                <div className="flex items-center gap-2 text-green-600">
                  <Award className="w-4 h-4" />
                  Great progress! Keep it up
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Headphones, Clock, BookOpen, Play, Trophy, Target, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface ListeningTest {
  id: number
  title: string
  audio_url?: string
  duration: number
  difficulty: string
  test_type: string
  description?: string
  total_questions: number
  created_at: string
}

interface ListeningProgress {
  test_id: number
  score: number
  total_questions: number
  band_score: number
  completed_at: string
}

export default function ListeningPage() {
  const [tests, setTests] = useState<ListeningTest[]>([])
  const [progress, setProgress] = useState<ListeningProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  useEffect(() => {
    checkSetupAndLoadData()
  }, [])

  const checkSetupAndLoadData = async () => {
    try {
      // Check if database is set up
      const setupResponse = await fetch('/api/listening/setup')
      const setupData = await setupResponse.json()
      
      if (!setupData.isSetupComplete) {
        // Setup database if not complete
        await fetch('/api/listening/setup', { method: 'POST' })
      }
      
      setIsSetupComplete(true)
      await loadTests()
      await loadProgress()
    } catch (error) {
      console.error('Setup check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTests = async () => {
    try {
      const response = await fetch(`/api/listening/tests?limit=20${filter !== 'all' ? `&difficulty=${filter}` : ''}`)
      const data = await response.json()
      
      if (data.success) {
        setTests(data.tests)
      }
    } catch (error) {
      console.error('Failed to load tests:', error)
    }
  }

  const loadProgress = async () => {
    // TODO: Load user progress when auth is implemented
    setProgress([])
  }

  useEffect(() => {
    if (isSetupComplete) {
      loadTests()
    }
  }, [filter, isSetupComplete])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} phút`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'mock_exam': return <Trophy className="w-4 h-4" />
      case 'skill_focus': return <Target className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const averageBandScore = progress.length > 0 
    ? (progress.reduce((sum, p) => sum + p.band_score, 0) / progress.length).toFixed(1)
    : '0.0'

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IELTS Listening</h1>
            <p className="text-gray-600">Luyện tập kỹ năng nghe với các đề thi thực tế</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số đề</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">{progress.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Band trung bình</p>
              <p className="text-2xl font-bold text-gray-900">{averageBandScore}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Thời gian luyện</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.reduce((total, test) => total + (test.duration || 0), 0) > 0 
                  ? formatDuration(tests.reduce((total, test) => total + (test.duration || 0), 0))
                  : '0 phút'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {level === 'all' ? 'Tất cả' : 
             level === 'beginner' ? 'Cơ bản' :
             level === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      {tests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Headphones className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có đề thi nào
          </h3>
          <p className="text-gray-600 mb-6">
            Chúng tôi đang chuẩn bị các đề thi IELTS Listening chất lượng cao cho bạn.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tải lại
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quản lý nội dung
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getTestTypeIcon(test.test_type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty === 'beginner' ? 'Cơ bản' :
                       test.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.duration ? formatDuration(test.duration) : 'N/A'}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {test.title}
                </h3>
                
                {test.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {test.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{test.total_questions} câu hỏi</span>
                  <span>{test.test_type === 'mock_exam' ? 'Đề thi thử' : 
                         test.test_type === 'skill_focus' ? 'Luyện kỹ năng' : 'Luyện tập'}</span>
                </div>

                <Link
                  href={`/listening/${test.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Bắt đầu luyện tập
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import ListeningTest from '@/components/ListeningTest'
import ListeningResults from '@/components/ListeningResults'

interface Question {
  id: number
  part_number: number
  question_number: number
  question_type: string
  question_text: string
  options?: string[]
  correct_answer: string
  explanation?: string
  audio_timestamp?: number
  audio_end_timestamp?: number
  points: number
}

interface Test {
  id: number
  title: string
  audio_url?: string
  audio_transcript?: string
  duration: number
  difficulty: string
  test_type: string
  description?: string
  instructions?: string
  total_questions: number
}

interface TestResults {
  score: number
  totalQuestions: number
  percentage: number
  bandScore: number
  timeTaken: number
  partScores: Record<string, { correct: number; total: number; percentage: number }>
  incorrectAnswers: Array<{
    questionNumber: number
    partNumber: number
    questionText: string
    userAnswer: string
    correctAnswer: string
    explanation?: string
  }>
  feedback: {
    overall: string
    strengths: string[]
    improvements: string[]
    nextSteps: string[]
  }
}

export default function ListeningTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testState, setTestState] = useState<'loading' | 'ready' | 'taking' | 'completed'>('loading')
  const [results, setResults] = useState<TestResults | null>(null)

  useEffect(() => {
    if (testId) {
      loadTestData()
    }
  }, [testId])

  const loadTestData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/listening/tests/${testId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load test')
      }

      if (data.success) {
        setTest(data.test)
        setQuestions(data.questions)
        setTestState('ready')
      } else {
        throw new Error('Test not found')
      }
    } catch (error) {
      console.error('Error loading test:', error)
      setError(error instanceof Error ? error.message : 'Failed to load test')
      setTestState('loading')
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = () => {
    setTestState('taking')
  }

  const handleSubmitTest = async (answers: Record<string, string>, timeTaken: number) => {
    if (!test) return

    try {
      setLoading(true)
      
      const response = await fetch('/api/listening/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: test.id,
          userId: 'demo-user', // TODO: Replace with actual user ID from auth
          answers,
          timeTaken,
          startedAt: new Date().toISOString()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit test')
      }

      if (data.success) {
        setResults(data.results)
        setTestState('completed')
      } else {
        throw new Error('Failed to process results')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit test')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProgress = async (answers: Record<string, string>) => {
    // TODO: Implement save progress to localStorage or API
    localStorage.setItem(`listening_test_${testId}_progress`, JSON.stringify({
      answers,
      timestamp: Date.now()
    }))
  }

  const handleRetakeTest = () => {
    setResults(null)
    setTestState('ready')
    // Clear saved progress
    localStorage.removeItem(`listening_test_${testId}_progress`)
  }

  if (loading && testState === 'loading') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải bài thi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={loadTestData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <Link
              href="/listening"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài thi</h2>
          <p className="text-gray-600 mb-6">Bài thi không tồn tại hoặc đã bị xóa.</p>
          <Link
            href="/listening"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  // Show results if completed
  if (testState === 'completed' && results) {
    return (
      <ListeningResults
        results={results}
        testTitle={test.title}
        onRetake={handleRetakeTest}
        onViewOtherTests={() => router.push('/listening')}
      />
    )
  }

  // Show test interface if taking
  if (testState === 'taking') {
    return (
      <ListeningTest
        test={test}
        questions={questions}
        onSubmit={handleSubmitTest}
        onSave={handleSaveProgress}
      />
    )
  }

  // Show test preview/ready state
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/listening"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </Link>

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{test.title}</h1>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
              {test.test_type === 'mock_exam' ? 'Đề thi thử' : 
               test.test_type === 'skill_focus' ? 'Luyện kỹ năng' : 'Luyện tập'}
            </span>
            <span className={`px-3 py-1 rounded-full font-medium ${
              test.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              test.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {test.difficulty === 'beginner' ? 'Cơ bản' :
               test.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
            </span>
          </div>

          {test.description && (
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {test.description}
            </p>
          )}
        </div>

        {/* Test Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{test.total_questions}</div>
            <div className="text-sm text-gray-600">Câu hỏi</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor((test.duration || 2400) / 60)}
            </div>
            <div className="text-sm text-gray-600">Phút</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-600">Parts</div>
          </div>
        </div>

        {/* Instructions */}
        {test.instructions && (
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Hướng dẫn làm bài</h3>
                <div className="text-blue-800 text-sm whitespace-pre-line">
                  {test.instructions}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parts Overview */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {[
            { part: 1, title: 'Conversation', desc: 'Hội thoại hàng ngày', questions: questions.filter(q => q.part_number === 1).length },
            { part: 2, title: 'Monologue', desc: 'Độc thoại về chủ đề thường ngày', questions: questions.filter(q => q.part_number === 2).length },
            { part: 3, title: 'Academic Discussion', desc: 'Thảo luận trong môi trường học thuật', questions: questions.filter(q => q.part_number === 3).length },
            { part: 4, title: 'Academic Lecture', desc: 'Bài giảng học thuật', questions: questions.filter(q => q.part_number === 4).length }
          ].map(part => (
            <div key={part.part} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Part {part.part}: {part.title}</h4>
                <span className="text-sm text-blue-600 font-medium">{part.questions} câu</span>
              </div>
              <p className="text-sm text-gray-600">{part.desc}</p>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-lg"
          >
            Bắt đầu làm bài
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Bài thi sẽ được tính thời gian ngay khi bạn bắt đầu
          </p>
        </div>
      </div>
    </div>
  )
}
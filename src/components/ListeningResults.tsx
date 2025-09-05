'use client'

import { useState } from 'react'
import { Trophy, Clock, BarChart3, CheckCircle, XCircle, Eye, EyeOff, Target, TrendingUp, Book } from 'lucide-react'
import Link from 'next/link'

interface IncorrectAnswer {
  questionNumber: number
  partNumber: number
  questionText: string
  userAnswer: string
  correctAnswer: string
  explanation?: string
}

interface PartScore {
  correct: number
  total: number
  percentage: number
}

interface Feedback {
  overall: string
  strengths: string[]
  improvements: string[]
  nextSteps: string[]
}

interface ListeningResultsProps {
  results: {
    score: number
    totalQuestions: number
    percentage: number
    bandScore: number
    timeTaken: number
    partScores: Record<string, PartScore>
    incorrectAnswers: IncorrectAnswer[]
    feedback: Feedback
  }
  testTitle: string
  onRetake?: () => void
  onViewOtherTests?: () => void
}

export default function ListeningResults({ results, testTitle, onRetake, onViewOtherTests }: ListeningResultsProps) {
  const [showIncorrectAnswers, setShowIncorrectAnswers] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'feedback'>('overview')

  const getBandScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-600 bg-green-100'
    if (score >= 7.0) return 'text-blue-600 bg-blue-100'
    if (score >= 6.0) return 'text-yellow-600 bg-yellow-100'
    if (score >= 5.0) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getBandScoreDescription = (score: number) => {
    if (score >= 8.5) return 'Xuất sắc - Very Good User'
    if (score >= 7.5) return 'Rất tốt - Good User'
    if (score >= 6.5) return 'Khá tốt - Competent User'
    if (score >= 5.5) return 'Trung bình - Modest User'
    if (score >= 4.5) return 'Hạn chế - Limited User'
    return 'Yếu - Extremely Limited User'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} phút ${secs} giây`
  }

  const getPartName = (partKey: string) => {
    switch (partKey) {
      case 'part1': return 'Part 1: Conversation'
      case 'part2': return 'Part 2: Monologue'
      case 'part3': return 'Part 3: Academic Discussion'
      case 'part4': return 'Part 4: Academic Lecture'
      default: return partKey.toUpperCase()
    }
  }

  const getPartPerformanceColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kết quả bài thi</h1>
        <p className="text-gray-600">{testTitle}</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 text-center">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${getBandScoreColor(results.bandScore)}`}>
              {results.bandScore}
            </div>
            <p className="text-sm text-gray-600 mt-2">Band Score</p>
            <p className="text-xs text-gray-500">{getBandScoreDescription(results.bandScore)}</p>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {results.score}/{results.totalQuestions}
            </div>
            <p className="text-sm text-gray-600 mt-2">Câu đúng</p>
            <p className="text-xs text-gray-500">{results.percentage.toFixed(1)}% chính xác</p>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-gray-900">
              <Clock className="w-8 h-8 inline mr-2" />
            </div>
            <p className="text-sm text-gray-600 mt-2">Thời gian</p>
            <p className="text-xs text-gray-500">{formatTime(results.timeTaken)}</p>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {results.incorrectAnswers.length}
            </div>
            <p className="text-sm text-gray-600 mt-2">Câu sai</p>
            <p className="text-xs text-gray-500">Cần xem lại</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="flex border-b">
          {[
            { key: 'overview', label: 'Tổng quan', icon: BarChart3 },
            { key: 'detailed', label: 'Chi tiết', icon: Eye },
            { key: 'feedback', label: 'Phản hồi', icon: Target }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'detailed' | 'feedback')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kết quả theo từng Part</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(results.partScores).map(([partKey, score]) => (
                  <div key={partKey} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{getPartName(partKey)}</h4>
                      <span className="text-sm text-gray-600">{score.correct}/{score.total}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${getPartPerformanceColor(score.percentage)}`}
                        style={{ width: `${score.percentage}%` }}
                      />
                    </div>
                    
                    <p className="text-sm text-gray-600">{score.percentage.toFixed(1)}% chính xác</p>
                  </div>
                ))}
              </div>

              {/* Performance Summary */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Tóm tắt kết quả</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Điểm mạnh:</h5>
                    <ul className="space-y-1">
                      {results.feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2 text-blue-700">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Cần cải thiện:</h5>
                    <ul className="space-y-1">
                      {results.feedback.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-center gap-2 text-blue-700">
                          <XCircle className="w-4 h-4 text-red-600" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Tab */}
          {activeTab === 'detailed' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Câu trả lời sai ({results.incorrectAnswers.length})
                </h3>
                <button
                  onClick={() => setShowIncorrectAnswers(!showIncorrectAnswers)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {showIncorrectAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showIncorrectAnswers ? 'Ẩn' : 'Hiện'} chi tiết
                </button>
              </div>

              {showIncorrectAnswers && results.incorrectAnswers.length > 0 && (
                <div className="space-y-4">
                  {results.incorrectAnswers.map((item, index) => (
                    <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                          {item.questionNumber}
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                              Part {item.partNumber}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 mb-3">{item.questionText}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 mb-1">Câu trả lời của bạn:</p>
                              <p className="font-medium text-red-700 bg-red-100 px-3 py-2 rounded">
                                {item.userAnswer || '(Trống)'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Đáp án đúng:</p>
                              <p className="font-medium text-green-700 bg-green-100 px-3 py-2 rounded">
                                {item.correctAnswer}
                              </p>
                            </div>
                          </div>
                          
                          {item.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Giải thích:</strong> {item.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.incorrectAnswers.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Hoàn hảo!</h4>
                  <p className="text-gray-600">Bạn đã trả lời đúng tất cả các câu hỏi.</p>
                </div>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Đánh giá tổng thể</h3>
                    <p className="text-blue-800">{results.feedback.overall}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Bước tiếp theo để cải thiện</h4>
                <ul className="space-y-2">
                  {results.feedback.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-800">
                      <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mt-0.5">
                        {index + 1}
                      </div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Trophy className="w-5 h-5" />
          Làm lại bài thi
        </button>
        
        <Link
          href="/listening"
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Book className="w-5 h-5" />
          Xem các đề khác
        </Link>
        
        <Link
          href="/progress"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          Xem tiến độ
        </Link>
      </div>
    </div>
  )
}
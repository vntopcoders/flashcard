'use client'

import { useState, useEffect } from 'react'
import { Clock, FileText, Save, Send, AlertCircle } from 'lucide-react'
import ListeningPlayer from './ListeningPlayer'

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

interface ListeningTestProps {
  test: Test
  questions: Question[]
  onSubmit: (answers: Record<string, string>, timeTaken: number) => void
  onSave?: (answers: Record<string, string>) => void
}

export default function ListeningTest({ test, questions, onSubmit, onSave }: ListeningTestProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentPart, setCurrentPart] = useState(1)
  const [timeLeft, setTimeLeft] = useState(test.duration || 2400) // Default 40 minutes
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [showInstructions, setShowInstructions] = useState(true)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)

  const startTime = Date.now()

  // Group questions by parts
  const questionsByPart = questions.reduce((acc, question) => {
    const part = question.part_number
    if (!acc[part]) acc[part] = []
    acc[part].push(question)
    return acc
  }, {} as Record<number, Question[]>)

  // Get question timestamps for audio player
  const questionTimestamps = questions
    .filter(q => q.audio_timestamp !== null)
    .map(q => ({
      questionNumber: q.question_number,
      start: q.audio_timestamp || 0,
      end: q.audio_end_timestamp
    }))

  // Timer effect
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerActive(false)
          handleSubmit() // Auto-submit when time is up
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionNumber: number, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionNumber.toString()]: value
    }
    setAnswers(updatedAnswers)
    onSave?.(updatedAnswers)
  }

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    setIsTimerActive(false)
    onSubmit(answers, timeTaken)
  }

  const getPartTitle = (partNumber: number) => {
    switch (partNumber) {
      case 1: return 'Part 1: Conversation'
      case 2: return 'Part 2: Monologue'
      case 3: return 'Part 3: Academic Discussion'
      case 4: return 'Part 4: Academic Lecture'
      default: return `Part ${partNumber}`
    }
  }

  const getPartDescription = (partNumber: number) => {
    switch (partNumber) {
      case 1: return 'Cuộc hội thoại giữa hai người trong bối cảnh xã hội hàng ngày'
      case 2: return 'Một người nói về chủ đề thường ngày'
      case 3: return 'Cuộc thảo luận giữa tối đa 4 người trong bối cảnh giáo dục'
      case 4: return 'Bài gi강 học thuật về một chủ đề cụ thể'
      default: return ''
    }
  }

  const renderQuestion = (question: Question) => {
    const questionKey = question.question_number.toString()
    const currentAnswer = answers[questionKey] || ''

    const baseClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-900 mb-3">{question.question_text}</p>
            <div className="space-y-2">
              {question.options?.map((option, index) => {
                const optionValue = String.fromCharCode(65 + index) // A, B, C, D
                return (
                  <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optionValue}
                      checked={currentAnswer === optionValue}
                      onChange={(e) => handleAnswerChange(question.question_number, e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-gray-900">{optionValue}. {option}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )

      case 'fill_blank':
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-900">{question.question_text}</p>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.question_number, e.target.value)}
              placeholder="Nhập câu trả lời..."
              className={baseClasses}
            />
          </div>
        )

      case 'matching':
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-900 mb-3">{question.question_text}</p>
            <select
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.question_number, e.target.value)}
              className={baseClasses}
            >
              <option value="">Chọn đáp án...</option>
              {question.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )

      case 'diagram':
      case 'map_labeling':
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-900">{question.question_text}</p>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.question_number, e.target.value)}
              placeholder="Nhập nhãn hoặc từ..."
              className={baseClasses}
            />
          </div>
        )

      default:
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-900">{question.question_text}</p>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.question_number, e.target.value)}
              placeholder="Nhập câu trả lời..."
              className={baseClasses}
            />
          </div>
        )
    }
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key].trim() !== '').length
  }

  if (showInstructions) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h1>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(test.duration || 2400)}
              </span>
              <span>{test.total_questions} câu hỏi</span>
              <span className="capitalize">{test.difficulty}</span>
            </div>
          </div>

          {test.instructions && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
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

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[1, 2, 3, 4].map(part => {
              const partQuestions = questionsByPart[part] || []
              return (
                <div key={part} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{getPartTitle(part)}</h4>
                  <p className="text-sm text-gray-600 mb-3">{getPartDescription(part)}</p>
                  <p className="text-sm font-medium text-blue-600">
                    {partQuestions.length} câu hỏi (Q{partQuestions[0]?.question_number}-Q{partQuestions[partQuestions.length - 1]?.question_number})
                  </p>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowInstructions(false)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Bắt đầu làm bài
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
            <p className="text-sm text-gray-600">{getAnsweredCount()}/{test.total_questions} câu đã trả lời</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`text-lg font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
              <Clock className="w-5 h-5 inline mr-2" />
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(answers)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
              
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Audio Player */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ListeningPlayer
              audioUrl={test.audio_url}
              audioText={test.audio_transcript}
              onTimeUpdate={setAudioCurrentTime}
              showTranscript={showTranscript}
              transcript={test.audio_transcript}
              questionTimestamps={questionTimestamps}
            />
            
            {test.audio_transcript && (
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                {showTranscript ? 'Ẩn' : 'Hiện'} Transcript
              </button>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="lg:col-span-2">
          {/* Part Navigation */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map(part => {
              const partQuestions = questionsByPart[part] || []
              if (partQuestions.length === 0) return null
              
              return (
                <button
                  key={part}
                  onClick={() => setCurrentPart(part)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPart === part
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Part {part}
                </button>
              )
            })}
          </div>

          {/* Current Part Questions */}
          {questionsByPart[currentPart] && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {getPartTitle(currentPart)}
                </h2>
                <p className="text-gray-600">{getPartDescription(currentPart)}</p>
              </div>

              <div className="space-y-6">
                {questionsByPart[currentPart].map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                        {question.question_number}
                      </div>
                      <div className="flex-1">
                        {renderQuestion(question)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
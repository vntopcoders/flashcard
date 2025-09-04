'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  BookOpen,
  ArrowRight,
  Volume2
} from 'lucide-react'
import { getCurrentUserId } from '@/lib/user-utils'
import Link from 'next/link'

interface ReviewFlashcard {
  id: string
  english: string
  vietnamese: string
  ipa?: string
  difficulty: number
  category: string
  lesson_id?: string
}

export default function SimpleReviewQueue() {
  const [flashcards, setFlashcards] = useState<ReviewFlashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    startTime: new Date()
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReviewCards()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadReviewCards = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get user's completed lessons to create review cards
      const userId = getCurrentUserId()
      const completedResponse = await fetch(`/api/daily-lesson/completed?user_id=${userId}`)
      
      if (completedResponse.ok) {
        const completedData = await completedResponse.json()
        const completedDays = completedData.data?.completed_days || []
        
        if (completedDays.length === 0) {
          setError('No completed lessons found. Complete some daily lessons first!')
          setLoading(false)
          return
        }
        
        // Generate review cards from completed days
        const reviewCards: ReviewFlashcard[] = []
        
        // Take a sample of completed days for review
        const sampleDays = completedDays.slice(-14) // Last 14 days
        
        sampleDays.forEach((day: number) => {
          // Generate some vocab from that day
          const dayCards = generateDayVocabulary(day)
          reviewCards.push(...dayCards.slice(0, 5)) // 5 words per day
        })
        
        // Shuffle the cards
        const shuffled = reviewCards.sort(() => Math.random() - 0.5)
        setFlashcards(shuffled.slice(0, 20)) // Max 20 cards per session
        
      } else {
        setError('Failed to load review data')
      }
      
    } catch (err) {
      console.error('Error loading review cards:', err)
      setError('Failed to load review cards')
    } finally {
      setLoading(false)
    }
  }

  const generateDayVocabulary = (dayNumber: number): ReviewFlashcard[] => {
    const baseWords = [
      { en: 'achieve', vi: 'đạt được', ipa: '/əˈtʃiːv/' },
      { en: 'analysis', vi: 'phân tích', ipa: '/əˈnæləsɪs/' },
      { en: 'approach', vi: 'tiếp cận', ipa: '/əˈproʊtʃ/' },
      { en: 'appropriate', vi: 'thích hợp', ipa: '/əˈproʊpriət/' },
      { en: 'benefit', vi: 'lợi ích', ipa: '/ˈbenɪfɪt/' },
      { en: 'category', vi: 'loại', ipa: '/ˈkætəɡɔːri/' },
      { en: 'community', vi: 'cộng đồng', ipa: '/kəˈmjuːnəti/' },
      { en: 'complex', vi: 'phức tạp', ipa: '/ˈkɑːmpleks/' },
      { en: 'conclusion', vi: 'kết luận', ipa: '/kənˈkluːʒn/' },
      { en: 'consistent', vi: 'nhất quán', ipa: '/kənˈsɪstənt/' },
      { en: 'create', vi: 'tạo ra', ipa: '/kriˈeɪt/' },
      { en: 'definition', vi: 'định nghĩa', ipa: '/ˌdefɪˈnɪʃn/' },
      { en: 'economic', vi: 'kinh tế', ipa: '/ˌiːkəˈnɑːmɪk/' },
      { en: 'environment', vi: 'môi trường', ipa: '/ɪnˈvaɪrənmənt/' },
      { en: 'evidence', vi: 'bằng chứng', ipa: '/ˈevɪdəns/' },
      { en: 'function', vi: 'chức năng', ipa: '/ˈfʌŋkʃn/' },
      { en: 'identify', vi: 'xác định', ipa: '/aɪˈdentɪfaɪ/' },
      { en: 'individual', vi: 'cá nhân', ipa: '/ˌɪndɪˈvɪdʒuəl/' },
      { en: 'method', vi: 'phương pháp', ipa: '/ˈmeθəd/' },
      { en: 'process', vi: 'quá trình', ipa: '/ˈprɑːses/' }
    ]
    
    const startIndex = (dayNumber - 1) * 3 % baseWords.length
    const selectedWords = []
    
    for (let i = 0; i < 8; i++) {
      const wordIndex = (startIndex + i) % baseWords.length
      const word = baseWords[wordIndex]
      selectedWords.push({
        id: `review-${dayNumber}-${i}`,
        english: word.en,
        vietnamese: word.vi,
        ipa: word.ipa,
        difficulty: Math.ceil(dayNumber / 60) + 1, // Difficulty based on day
        category: 'review',
        lesson_id: `day-${dayNumber}`
      })
    }
    
    return selectedWords
  }

  const handleAnswer = (quality: 'easy' | 'good' | 'hard' | 'again') => {
    setSessionStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      correct: quality !== 'again' ? prev.correct + 1 : prev.correct
    }))
    
    setShowAnswer(false)
    
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Session complete
      handleSessionComplete()
    }
  }

  const handleSessionComplete = () => {
    const duration = Math.round((new Date().getTime() - sessionStats.startTime.getTime()) / 1000 / 60)
    const accuracy = Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
    
    alert(`🎉 Review session complete!\n\nCards reviewed: ${sessionStats.reviewed}\nAccuracy: ${accuracy}%\nTime: ${duration} minutes`)
    
    // Reset for new session
    setCurrentIndex(0)
    setSessionStats({
      reviewed: 0,
      correct: 0,
      startTime: new Date()
    })
    loadReviewCards()
  }

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review cards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Review Cards</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/study-plan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Go to Study Plan
          </Link>
        </div>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h2>
          <p className="text-gray-600 mb-6">No cards to review right now.</p>
          <button
            onClick={loadReviewCards}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Again
          </button>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Review Session</h1>
                <p className="text-gray-600">Card {currentIndex + 1} of {flashcards.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-lg font-bold text-gray-900">
                {sessionStats.reviewed > 0 ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100) : 0}%
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 min-h-[300px] flex flex-col justify-center">
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCard.english}
              </h2>
              {currentCard.ipa && (
                <p className="text-gray-600 text-lg mb-4">{currentCard.ipa}</p>
              )}
              <button
                onClick={() => playPronunciation(currentCard.english)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Play Audio
              </button>
            </div>

            {showAnswer && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900 mb-2">
                  {currentCard.vietnamese}
                </p>
                <p className="text-blue-700">
                  Category: {currentCard.category} • Level {currentCard.difficulty}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Answer
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleAnswer('again')}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                Again
                <div className="text-xs opacity-75">Didn&apos;t know</div>
              </button>
              <button
                onClick={() => handleAnswer('hard')}
                className="px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
              >
                Hard
                <div className="text-xs opacity-75">Difficult</div>
              </button>
              <button
                onClick={() => handleAnswer('good')}
                className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
                Good
                <div className="text-xs opacity-75">Remembered</div>
              </button>
              <button
                onClick={() => handleAnswer('easy')}
                className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
              >
                Easy
                <div className="text-xs opacity-75">Too easy</div>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-gray-600">Reviewed</p>
            <p className="text-xl font-bold text-gray-900">{sessionStats.reviewed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-gray-600">Correct</p>
            <p className="text-xl font-bold text-green-600">{sessionStats.correct}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-xl font-bold text-blue-600">{flashcards.length - currentIndex - 1}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
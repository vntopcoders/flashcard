'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  Brain, 
  Target,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface ReviewCard {
  id: string
  flashcard_id: string
  english: string
  vietnamese: string
  ipa?: string
  difficulty: number
  category: string
  next_review_date: string
  current_interval_days: number
  current_easiness_factor: number
  card_state: string
  lesson?: {
    name: string
    color: string
  }
}

interface ReviewSession {
  id: string
  cards: ReviewCard[]
  currentIndex: number
  startTime: Date
  responses: ReviewResponse[]
  isComplete: boolean
}

interface ReviewResponse {
  flashcard_id: string
  quality: number
  response_time_ms: number
  is_correct: boolean
}

export default function ReviewQueue() {
  const [session, setSession] = useState<ReviewSession | null>(null)
  const [currentCard, setCurrentCard] = useState<ReviewCard | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reviewStartTime, setReviewStartTime] = useState<Date | null>(null)
  const [studySchedule, setStudySchedule] = useState<{
    totalDue: number;
    newCardsToday: number;
    reviewsToday: number;
    newAvailable: number;
    reviewsCompleted: number;
    streak: number;
    recommendedSession: {
      reason: string;
    };
  } | null>(null)

  // Load study schedule on mount
  useEffect(() => {
    loadStudySchedule()
  }, [])

  const loadStudySchedule = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/spaced-repetition/study-schedule')
      if (response.ok) {
        const data = await response.json()
        setStudySchedule(data.schedule)
      }
    } catch (error) {
      console.error('Failed to load study schedule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startReviewSession = async (sessionType: 'reviews' | 'new_cards' | 'mixed' = 'mixed') => {
    try {
      setIsLoading(true)
      
      // Start session
      const sessionResponse = await fetch('/api/spaced-repetition/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_type: sessionType })
      })
      
      if (!sessionResponse.ok) throw new Error('Failed to start session')
      const sessionData = await sessionResponse.json()
      
      // Get cards based on session type
      let cardsEndpoint = '/api/spaced-repetition/cards-due?limit=30'
      if (sessionType === 'new_cards') {
        cardsEndpoint = '/api/spaced-repetition/new-cards?limit=20'
      }
      
      const cardsResponse = await fetch(cardsEndpoint)
      if (!cardsResponse.ok) throw new Error('Failed to load cards')
      const cardsData = await cardsResponse.json()
      
      if (cardsData.cards.length === 0) {
        alert('No cards available for review!')
        return
      }
      
      // Initialize session
      const newSession: ReviewSession = {
        id: sessionData.session.id,
        cards: cardsData.cards,
        currentIndex: 0,
        startTime: new Date(),
        responses: [],
        isComplete: false
      }
      
      setSession(newSession)
      setCurrentCard(cardsData.cards[0])
      setIsFlipped(false)
      setReviewStartTime(new Date())
      
    } catch (error) {
      console.error('Failed to start review session:', error)
      alert('Failed to start review session. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const submitReview = async (quality: number) => {
    if (!session || !currentCard || !reviewStartTime) return

    try {
      const responseTime = Date.now() - reviewStartTime.getTime()
      
      // Submit review to API
      const response = await fetch('/api/spaced-repetition/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flashcard_id: currentCard.flashcard_id,
          quality,
          response_time_ms: responseTime
        })
      })
      
      if (!response.ok) throw new Error('Failed to submit review')
      
      // Update session
      const newResponse: ReviewResponse = {
        flashcard_id: currentCard.flashcard_id,
        quality,
        response_time_ms: responseTime,
        is_correct: quality >= 3
      }
      
      const updatedSession = {
        ...session,
        responses: [...session.responses, newResponse]
      }
      
      // Move to next card or complete session
      if (session.currentIndex < session.cards.length - 1) {
        const nextIndex = session.currentIndex + 1
        updatedSession.currentIndex = nextIndex
        setSession(updatedSession)
        setCurrentCard(session.cards[nextIndex])
        setIsFlipped(false)
        setReviewStartTime(new Date())
      } else {
        // Session complete
        await completeSession(updatedSession)
      }
      
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review. Please try again.')
    }
  }

  const completeSession = async (completedSession: ReviewSession) => {
    try {
      const results = {
        cards_studied: completedSession.responses.length,
        new_cards: completedSession.cards.filter(c => c.card_state === 'new').length,
        review_cards: completedSession.cards.filter(c => c.card_state !== 'new').length,
        correct_answers: completedSession.responses.filter(r => r.is_correct).length,
        incorrect_answers: completedSession.responses.filter(r => !r.is_correct).length
      }
      
      await fetch('/api/spaced-repetition/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: completedSession.id,
          results
        })
      })
      
      setSession({ ...completedSession, isComplete: true })
      setCurrentCard(null)
      
      // Reload study schedule
      await loadStudySchedule()
      
    } catch (error) {
      console.error('Failed to complete session:', error)
    }
  }

  const resetSession = () => {
    setSession(null)
    setCurrentCard(null)
    setIsFlipped(false)
    setReviewStartTime(null)
    loadStudySchedule()
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const getQualityLabel = (quality: number): string => {
    switch (quality) {
      case 0: return 'Complete Blackout'
      case 1: return 'Incorrect but Familiar'
      case 2: return 'Incorrect but Easy'
      case 3: return 'Correct with Difficulty'
      case 4: return 'Correct with Hesitation'
      case 5: return 'Perfect Recall'
      default: return 'Unknown'
    }
  }

  const getQualityColor = (quality: number): string => {
    switch (quality) {
      case 0: return 'bg-red-600 hover:bg-red-700'
      case 1: return 'bg-red-500 hover:bg-red-600'
      case 2: return 'bg-orange-500 hover:bg-orange-600'
      case 3: return 'bg-yellow-500 hover:bg-yellow-600'
      case 4: return 'bg-blue-500 hover:bg-blue-600'
      case 5: return 'bg-green-500 hover:bg-green-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  // Session complete view
  if (session?.isComplete) {
    const accuracy = session.responses.length > 0 
      ? Math.round((session.responses.filter(r => r.is_correct).length / session.responses.length) * 100)
      : 0
    const avgTime = session.responses.length > 0
      ? Math.round(session.responses.reduce((sum, r) => sum + r.response_time_ms, 0) / session.responses.length / 1000)
      : 0

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Session Complete! 🎉
            </h2>
            <p className="text-gray-600">
              Great job on completing your review session
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {session.responses.length}
              </div>
              <div className="text-sm text-gray-600">Cards Reviewed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {avgTime}s
              </div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((Date.now() - session.startTime.getTime()) / 60000)}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
          </div>

          <button
            onClick={resetSession}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Start New Session
          </button>
        </div>
      </div>
    )
  }

  // Active review session
  if (session && currentCard) {
    const progress = Math.round(((session.currentIndex + 1) / session.cards.length) * 100)
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">
              Review Progress
            </h3>
            <span className="text-sm text-gray-600">
              {session.currentIndex + 1} / {session.cards.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div 
            className={`min-h-[300px] flex items-center justify-center cursor-pointer transition-all duration-300 ${
              isFlipped ? 'transform' : ''
            }`}
            onClick={flipCard}
          >
            {!isFlipped ? (
              // Front side - English word
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-4">
                  {currentCard.english}
                </div>
                {currentCard.ipa && (
                  <div className="text-lg text-gray-600 mb-4">
                    {currentCard.ipa}
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {currentCard.category} • Level {currentCard.difficulty}
                </div>
                <p className="text-gray-500 mt-6 text-sm">
                  Click to see meaning
                </p>
              </div>
            ) : (
              // Back side - Vietnamese meaning
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {currentCard.vietnamese}
                </div>
                <div className="text-xl text-gray-700 mb-4">
                  {currentCard.english}
                </div>
                {currentCard.ipa && (
                  <div className="text-lg text-gray-600 mb-4">
                    {currentCard.ipa}
                  </div>
                )}
                {currentCard.lesson && (
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white"
                    style={{ backgroundColor: currentCard.lesson.color }}
                  >
                    {currentCard.lesson.name}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quality Rating Buttons */}
        {isFlipped && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              How well did you know this word?
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map(quality => (
                <button
                  key={quality}
                  onClick={() => submitReview(quality)}
                  className={`p-4 rounded-lg text-white font-medium transition-colors ${getQualityColor(quality)}`}
                >
                  <div className="text-lg font-bold mb-1">{quality}</div>
                  <div className="text-sm opacity-90">
                    {getQualityLabel(quality)}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              0-2: Incorrect answers | 3-5: Correct answers with varying confidence
            </p>
          </div>
        )}
      </div>
    )
  }

  // Main dashboard view
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📚 Review Queue
        </h1>
        <p className="text-gray-600">
          Study your vocabulary with spaced repetition for optimal retention
        </p>
      </div>

      {studySchedule && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Due Today</h3>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {studySchedule.totalDue}
            </div>
            <p className="text-sm text-gray-600">Cards ready for review</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">New Cards</h3>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {studySchedule.newAvailable}
            </div>
            <p className="text-sm text-gray-600">Ready to learn</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-800">Today&apos;s Progress</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {studySchedule.reviewsCompleted}
            </div>
            <p className="text-sm text-gray-600">Cards reviewed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Streak</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {studySchedule.streak}
            </div>
            <p className="text-sm text-gray-600">Days in a row</p>
          </div>
        </div>
      )}

      {/* Session Start Buttons */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Review Session
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Review cards that are due today. Strengthen your memory with spaced repetition.
            </p>
            <button
              onClick={() => startReviewSession('reviews')}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Loading...' : 'Start Review'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <Brain className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Learn New Words
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover new vocabulary and add them to your learning queue.
            </p>
            <button
              onClick={() => startReviewSession('new_cards')}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Loading...' : 'Learn New'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Mixed Session
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Balanced combination of review and new cards for optimal learning.
            </p>
            <button
              onClick={() => startReviewSession('mixed')}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Loading...' : 'Mixed Study'}
            </button>
          </div>
        </div>
      </div>

      {studySchedule?.recommendedSession && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                Recommended for you
              </h4>
              <p className="text-blue-700 text-sm">
                {studySchedule.recommendedSession.reason}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
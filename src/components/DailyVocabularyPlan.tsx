'use client'

import { useState, useEffect } from 'react'
import { Calendar, Target, TrendingUp, Clock, Star, Brain, Award, Zap } from 'lucide-react'
import { SpacedRepetitionService } from '@/lib/spaced-repetition'
import { Flashcard } from '@/types/flashcard'
import EnhancedFlashcardComponent from './EnhancedFlashcardComponent'

interface DailyPlanProps {
  onStudyComplete?: () => void
}

interface StudyStats {
  dueToday: number
  newAvailable: number
  reviewsCompleted: number
  accuracy: number
  streak: number
  recommendedSession: {
    type: string
    cardCount: number
    reason: string
  }
}

interface StudySession {
  cards: Flashcard[]
  currentIndex: number
  results: {
    correct: number
    incorrect: number
  }
  startTime: Date
}

export default function DailyVocabularyPlan({ onStudyComplete }: DailyPlanProps) {
  const [stats, setStats] = useState<StudyStats | null>(null)
  const [studySession, setStudySession] = useState<StudySession | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)

  useEffect(() => {
    loadDailyStats()
  }, [])

  const loadDailyStats = async () => {
    try {
      setLoading(true)
      const dailyStats = await SpacedRepetitionService.getStudySchedule()
      setStats(dailyStats)
    } catch (error) {
      console.error('Failed to load daily stats:', error)
      // Mock data for development
      setStats({
        dueToday: 12,
        newAvailable: 8,
        reviewsCompleted: 3,
        accuracy: 85,
        streak: 7,
        recommendedSession: {
          type: 'mixed',
          cardCount: 20,
          reason: 'Perfect balance of review and new vocabulary'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const startStudySession = async () => {
    try {
      // Mock flashcards for development - replace with actual API call
      const mockCards: Flashcard[] = [
        {
          id: '1',
          english: 'abundant',
          vietnamese: 'dồi dào, phong phú',
          ipa: 'əˈbʌndənt',
          difficulty: 3,
          category: 'Academic',
          examples: [
            {
              sentence: 'The region has abundant natural resources.',
              translation: 'Vùng này có tài nguyên thiên nhiên dồi dào.',
              context: 'Geography/Economics'
            },
            {
              sentence: 'She provided abundant evidence for her theory.',
              translation: 'Cô ấy đã cung cấp bằng chứng dồi dào cho lý thuyết của mình.',
              context: 'Academic Writing'
            }
          ],
          collocations: [
            {
              phrase: 'abundant resources',
              meaning: 'tài nguyên dồi dào',
              example: 'The country is blessed with abundant natural resources.'
            },
            {
              phrase: 'abundant evidence',
              meaning: 'bằng chứng dồi dào',
              example: 'There is abundant evidence supporting this claim.'
            }
          ],
          synonyms: ['plentiful', 'ample', 'copious', 'extensive'],
          antonyms: ['scarce', 'limited', 'insufficient'],
          etymology: 'From Latin abundare "to overflow, to be in great plenty"',
          memory_tips: 'Think of "a BUNDle ANT" - ants work in bundles/groups, showing abundance!',
          ease_factor: 2.5,
          interval: 1,
          repetitions: 0,
          times_studied: 0,
          times_correct: 0,
          times_wrong: 0,
          mastery_level: 'new',
          lessonId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          english: 'deteriorate',
          vietnamese: 'xấu đi, suy thoái',
          ipa: 'dɪˈtɪəriəreɪt',
          difficulty: 4,
          category: 'Academic',
          examples: [
            {
              sentence: 'The building began to deteriorate after years of neglect.',
              translation: 'Tòa nhà bắt đầu xuống cấp sau nhiều năm bị bỏ mặc.',
              context: 'Construction/Maintenance'
            },
            {
              sentence: 'His health deteriorated rapidly.',
              translation: 'Sức khỏe của anh ấy suy giảm nhanh chóng.',
              context: 'Health/Medical'
            }
          ],
          collocations: [
            {
              phrase: 'deteriorate rapidly',
              meaning: 'xấu đi nhanh chóng',
              example: 'The situation deteriorated rapidly.'
            },
            {
              phrase: 'health deteriorates',
              meaning: 'sức khỏe suy giảm',
              example: 'His health has been deteriorating for months.'
            }
          ],
          synonyms: ['decline', 'degenerate', 'worsen', 'decay'],
          antonyms: ['improve', 'enhance', 'strengthen'],
          etymology: 'From Latin deterioratus "made worse"',
          memory_tips: 'DE-TERIOR-ATE: Think "getting to a TERRIBLE state"',
          ease_factor: 2.3,
          interval: 2,
          repetitions: 1,
          times_studied: 2,
          times_correct: 1,
          times_wrong: 1,
          mastery_level: 'learning',
          lessonId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      setStudySession({
        cards: mockCards,
        currentIndex: 0,
        results: { correct: 0, incorrect: 0 },
        startTime: new Date()
      })
    } catch (error) {
      console.error('Failed to start study session:', error)
    }
  }

  const handleCardStudy = (correct: boolean) => {
    if (!studySession) return

    const newResults = {
      correct: studySession.results.correct + (correct ? 1 : 0),
      incorrect: studySession.results.incorrect + (correct ? 0 : 1)
    }

    if (studySession.currentIndex < studySession.cards.length - 1) {
      setStudySession({
        ...studySession,
        currentIndex: studySession.currentIndex + 1,
        results: newResults
      })
    } else {
      // Session complete
      setStudySession({
        ...studySession,
        results: newResults
      })
      setSessionComplete(true)
      onStudyComplete?.()
    }
  }

  const resetSession = () => {
    setStudySession(null)
    setSessionComplete(false)
    loadDailyStats()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading your daily plan...</span>
      </div>
    )
  }

  if (studySession && !sessionComplete) {
    const currentCard = studySession.cards[studySession.currentIndex]
    const progress = ((studySession.currentIndex) / studySession.cards.length) * 100

    return (
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Study Progress</h3>
            <span className="text-sm text-gray-600">
              {studySession.currentIndex + 1} of {studySession.cards.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>✅ {studySession.results.correct} correct</span>
            <span>❌ {studySession.results.incorrect} incorrect</span>
          </div>
        </div>

        {/* Current Card */}
        <EnhancedFlashcardComponent
          flashcard={currentCard}
          onStudyComplete={handleCardStudy}
          showProgress={true}
        />
      </div>
    )
  }

  if (sessionComplete && studySession) {
    const accuracy = studySession.results.correct / (studySession.results.correct + studySession.results.incorrect) * 100
    const sessionTime = Math.round((new Date().getTime() - studySession.startTime.getTime()) / 1000 / 60)

    return (
      <div className="bg-white rounded-lg p-6 border text-center">
        <div className="mb-4">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Complete! 🎉</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{studySession.results.correct}</div>
            <div className="text-sm text-green-700">Correct</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{studySession.results.incorrect}</div>
            <div className="text-sm text-red-700">Incorrect</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{Math.round(accuracy)}%</div>
            <div className="text-sm text-blue-700">Accuracy</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{sessionTime}m</div>
            <div className="text-sm text-purple-700">Duration</div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {accuracy >= 90 && (
            <div className="bg-gold-50 border border-yellow-200 rounded-lg p-3">
              <span className="text-yellow-700">🏆 Excellent! You&apos;re mastering these words!</span>
            </div>
          )}
          {accuracy >= 70 && accuracy < 90 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <span className="text-green-700">👍 Good progress! Keep practicing!</span>
            </div>
          )}
          {accuracy < 70 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-blue-700">💪 Keep going! These words will get easier with practice!</span>
            </div>
          )}
        </div>

        <button
          onClick={resetSession}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Learning
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Daily Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Today&apos;s Vocabulary Plan
          </h2>
          <div className="flex items-center gap-2 text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            <Star className="w-4 h-4" />
            <span className="font-semibold">{stats?.streak} day streak</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats?.dueToday}</div>
            <div className="text-sm text-gray-600">Due Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats?.newAvailable}</div>
            <div className="text-sm text-gray-600">New Words</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats?.reviewsCompleted}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats?.accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">AI Recommendation</h3>
              <p className="text-gray-700 text-sm">{stats?.recommendedSession.reason}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Session Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => startStudySession()}
          className="bg-white rounded-lg p-6 border hover:border-red-300 hover:bg-red-50 transition-all group"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Review Due Cards</h3>
            <p className="text-sm text-gray-600 mb-3">Focus on cards that need review</p>
            <div className="text-2xl font-bold text-red-600">{stats?.dueToday}</div>
            <div className="text-xs text-gray-500">cards waiting</div>
          </div>
        </button>

        <button
          onClick={() => startStudySession()}
          className="bg-white rounded-lg p-6 border hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Learn New Words</h3>
            <p className="text-sm text-gray-600 mb-3">Discover new vocabulary</p>
            <div className="text-2xl font-bold text-blue-600">{stats?.newAvailable}</div>
            <div className="text-xs text-gray-500">new words</div>
          </div>
        </button>

        <button
          onClick={() => startStudySession()}
          className="bg-white rounded-lg p-6 border hover:border-green-300 hover:bg-green-50 transition-all group relative"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Recommended
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Mixed Session</h3>
            <p className="text-sm text-gray-600 mb-3">Balanced review + new words</p>
            <div className="text-2xl font-bold text-green-600">{stats?.recommendedSession.cardCount}</div>
            <div className="text-xs text-gray-500">optimal mix</div>
          </div>
        </button>
      </div>

      {/* Learning Tips */}
      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Quick Learning Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">💡</span>
            <span className="text-yellow-700">Use the example sentences to understand context</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">🔊</span>
            <span className="text-yellow-700">Listen to pronunciation and repeat out loud</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">📝</span>
            <span className="text-yellow-700">Create your own sentences with new words</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">🧠</span>
            <span className="text-yellow-700">Use memory tips and word associations</span>
          </div>
        </div>
      </div>
    </div>
  )
}
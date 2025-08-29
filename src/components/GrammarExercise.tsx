'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen, 
  Brain, 
  Target,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Lightbulb
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface GrammarPoint {
  concept: string
  rule: string
  examples: string[]
}

interface Exercise {
  id: string
  type: 'multiple_choice' | 'fill_blank' | 'correction' | 'transformation'
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface GrammarLesson {
  id: string
  unit_number: number
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  grammar_points: GrammarPoint[]
  exercises: Exercise[]
  estimated_minutes: number
}

interface ExerciseResult {
  exerciseId: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number
}

export default function GrammarExercise() {
  const { user, isAuthenticated } = useCurrentUser()
  const [lessons, setLessons] = useState<GrammarLesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<GrammarLesson | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [mode, setMode] = useState<'learn' | 'practice' | 'test'>('learn')

  useEffect(() => {
    loadGrammarLessons()
  }, [])

  useEffect(() => {
    if (currentLesson && currentExerciseIndex >= 0) {
      setStartTime(Date.now())
    }
  }, [currentLesson, currentExerciseIndex])

  const loadGrammarLessons = async () => {
    try {
      setIsLoading(true)
      
      // Mock grammar lessons data
      const mockLessons: GrammarLesson[] = [
        {
          id: '1',
          unit_number: 26,
          title: 'Present Perfect vs Past Simple',
          description: 'Understanding the difference between Present Perfect and Past Simple tenses',
          level: 'intermediate',
          grammar_points: [
            {
              concept: 'Present Perfect',
              rule: 'Use Present Perfect for actions that started in the past and continue to the present, or for past actions with present relevance.',
              examples: [
                'I have lived here for 5 years. (still living here)',
                'She has just finished her homework. (recent action with present result)',
                'Have you ever been to Japan? (experience up to now)'
              ]
            },
            {
              concept: 'Past Simple',
              rule: 'Use Past Simple for completed actions in the past with a specific time reference.',
              examples: [
                'I lived in Tokyo last year. (completed action with time reference)',
                'She finished her homework yesterday. (completed action in the past)',
                'Did you go to Japan in 2019? (specific past time)'
              ]
            }
          ],
          estimated_minutes: 25,
          exercises: [
            {
              id: 'ex1',
              type: 'multiple_choice',
              question: 'I _____ this book three times already.',
              options: ['read', 'have read', 'was reading', 'had read'],
              correct_answer: 'have read',
              explanation: 'Use Present Perfect for an action repeated up to the present moment. "Three times already" indicates repetition continuing to now.',
              difficulty: 'medium'
            },
            {
              id: 'ex2',
              type: 'multiple_choice',
              question: 'She _____ to Paris last summer.',
              options: ['has gone', 'went', 'was going', 'had gone'],
              correct_answer: 'went',
              explanation: 'Use Past Simple with specific time references like "last summer". The action is completed in the past.',
              difficulty: 'easy'
            },
            {
              id: 'ex3',
              type: 'fill_blank',
              question: 'I _____ (never / see) such a beautiful sunset before.',
              options: [],
              correct_answer: 'have never seen',
              explanation: 'Present Perfect is used with "never" for experiences up to the present moment.',
              difficulty: 'medium'
            },
            {
              id: 'ex4',
              type: 'correction',
              question: 'Correct the mistake: "I have visited my grandmother yesterday."',
              options: [],
              correct_answer: 'I visited my grandmother yesterday.',
              explanation: '"Yesterday" is a specific past time reference, so we must use Past Simple, not Present Perfect.',
              difficulty: 'hard'
            },
            {
              id: 'ex5',
              type: 'transformation',
              question: 'Transform using Present Perfect: "She started learning English two years ago and still learns it."',
              options: [],
              correct_answer: 'She has been learning English for two years.',
              explanation: 'Present Perfect Continuous shows an action that started in the past and continues to the present.',
              difficulty: 'hard'
            }
          ]
        },
        {
          id: '2',
          unit_number: 27,
          title: 'Modal Verbs of Possibility',
          description: 'Using may, might, could, can\'t, must for expressing possibility and certainty',
          level: 'intermediate',
          grammar_points: [
            {
              concept: 'Strong Possibility',
              rule: 'Use "must" for strong logical deduction, "will" for strong prediction.',
              examples: [
                'The lights are on. Someone must be home.',
                'It\'s very cloudy. It will probably rain.',
                'She\'s been studying all night. She must be tired.'
              ]
            },
            {
              concept: 'Weak Possibility',
              rule: 'Use "may", "might", "could" for uncertain possibilities.',
              examples: [
                'It may rain later. (50% chance)',
                'She might come to the party. (uncertain)',
                'This could be the answer. (possible but not certain)'
              ]
            }
          ],
          estimated_minutes: 20,
          exercises: [
            {
              id: 'ex6',
              type: 'multiple_choice',
              question: 'The phone is ringing. It _____ be John calling.',
              options: ['must', 'can\'t', 'might', 'will'],
              correct_answer: 'might',
              explanation: 'Use "might" for uncertain possibilities. We don\'t know for sure who is calling.',
              difficulty: 'medium'
            },
            {
              id: 'ex7',
              type: 'multiple_choice',
              question: 'She _____ be at work now. It\'s only 6 AM and the office is closed.',
              options: ['must', 'can\'t', 'may', 'will'],
              correct_answer: 'can\'t',
              explanation: 'Use "can\'t" for logical impossibility based on the given information.',
              difficulty: 'easy'
            }
          ]
        }
      ]
      
      setLessons(mockLessons)
      setCurrentLesson(mockLessons[0])
      
    } catch (error) {
      console.error('Failed to load grammar lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSubmit = () => {
    if (!currentLesson || !currentAnswer.trim()) return

    const currentExercise = currentLesson.exercises[currentExerciseIndex]
    const isCorrect = currentAnswer.toLowerCase().trim() === currentExercise.correct_answer.toLowerCase().trim()
    const timeSpent = Date.now() - startTime

    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      userAnswer: currentAnswer,
      isCorrect,
      timeSpent
    }

    setExerciseResults([...exerciseResults, result])
    setShowExplanation(true)
  }

  const handleNextExercise = () => {
    if (!currentLesson) return

    if (currentExerciseIndex < currentLesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentAnswer('')
      setShowExplanation(false)
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
      setCurrentAnswer('')
      setShowExplanation(false)
    }
  }

  const handleRestartLesson = () => {
    setCurrentExerciseIndex(0)
    setCurrentAnswer('')
    setShowExplanation(false)
    setExerciseResults([])
    setShowResults(false)
  }

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <Target className="w-4 h-4" />
      case 'fill_blank': return <BookOpen className="w-4 h-4" />
      case 'correction': return <Brain className="w-4 h-4" />
      case 'transformation': return <RotateCcw className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'  
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const calculateScore = () => {
    if (exerciseResults.length === 0) return 0
    const correct = exerciseResults.filter(r => r.isCorrect).length
    return Math.round((correct / exerciseResults.length) * 100)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to access grammar exercises
          </h2>
          <p className="text-gray-600">
            Practice IELTS grammar with interactive exercises and instant feedback.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const totalTime = exerciseResults.reduce((sum, r) => sum + r.timeSpent, 0)

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">
            {score >= 80 ? '🏆' : score >= 60 ? '🎯' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Exercise Complete!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {currentLesson?.title}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-blue-600">Score</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {exerciseResults.filter(r => r.isCorrect).length}
              </div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(totalTime / 1000 / 60)}m
              </div>
              <div className="text-sm text-purple-600">Time</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-800">Performance:</h3>
            {exerciseResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">Exercise {index + 1}</span>
                <div className="flex items-center gap-2">
                  {result.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-600">
                    {Math.round(result.timeSpent / 1000)}s
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestartLesson}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => {
                const nextLessonIndex = lessons.findIndex(l => l.id === currentLesson?.id) + 1
                if (nextLessonIndex < lessons.length) {
                  setCurrentLesson(lessons[nextLessonIndex])
                  handleRestartLesson()
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={lessons.findIndex(l => l.id === currentLesson?.id) >= lessons.length - 1}
            >
              <ArrowRight className="w-4 h-4" />
              Next Lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No lessons available
          </h2>
          <p className="text-gray-600">
            Grammar lessons will be available soon.
          </p>
        </div>
      </div>
    )
  }

  const currentExercise = currentLesson.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / currentLesson.exercises.length) * 100

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Grammar Exercise</h1>
            <p className="text-gray-600">Unit {currentLesson.unit_number}: {currentLesson.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {currentExerciseIndex + 1} / {currentLesson.exercises.length}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Grammar points (show before exercises) */}
        {currentExerciseIndex === 0 && !showExplanation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Key Grammar Points
            </h3>
            <div className="space-y-3">
              {currentLesson.grammar_points.map((point, index) => (
                <div key={index}>
                  <h4 className="font-medium text-blue-700">{point.concept}</h4>
                  <p className="text-sm text-blue-600 mb-2">{point.rule}</p>
                  <div className="text-xs text-blue-500">
                    Examples: {point.examples.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exercise */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${getDifficultyColor(currentExercise.difficulty)}`}>
            {getExerciseIcon(currentExercise.type)}
          </div>
          <div>
            <div className="font-medium text-gray-800">
              Exercise {currentExerciseIndex + 1}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {currentExercise.type.replace('_', ' ')} • {currentExercise.difficulty}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {currentExercise.question}
          </h3>

          {currentExercise.type === 'multiple_choice' && currentExercise.options && (
            <div className="space-y-2">
              {currentExercise.options.map((option, index) => (
                <label key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={currentAnswer === option}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          {(currentExercise.type === 'fill_blank' || currentExercise.type === 'correction' || currentExercise.type === 'transformation') && (
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          )}
        </div>

        {showExplanation && (
          <div className={`p-4 rounded-lg mb-4 ${
            exerciseResults[exerciseResults.length - 1]?.isCorrect 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {exerciseResults[exerciseResults.length - 1]?.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                exerciseResults[exerciseResults.length - 1]?.isCorrect 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                {exerciseResults[exerciseResults.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Correct answer:</strong> {currentExercise.correct_answer}
            </p>
            <p className="text-sm text-gray-600">
              {currentExercise.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {!showExplanation ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={!currentAnswer.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextExercise}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentExerciseIndex < currentLesson.exercises.length - 1 ? (
                <>Next <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Finish <Award className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Lesson selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-medium text-gray-800 mb-3">Available Lessons</h3>
        <div className="grid gap-2">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                setCurrentLesson(lesson)
                handleRestartLesson()
              }}
              className={`text-left p-3 rounded-lg border transition-colors ${
                lesson.id === currentLesson.id
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-800">
                Unit {lesson.unit_number}: {lesson.title}
              </div>
              <div className="text-sm text-gray-600">
                {lesson.exercises.length} exercises • ~{lesson.estimated_minutes} minutes • {lesson.level}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
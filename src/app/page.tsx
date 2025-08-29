'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Plus, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react'
import FlashcardComponent from '@/components/FlashcardComponent'
import AddFlashcardForm from '@/components/AddFlashcardForm'
import WelcomeDashboard from '@/components/WelcomeDashboard'
import LessonChunksSelector from '@/components/LessonChunksSelector'
import { Flashcard, Lesson } from '@/types/flashcard'
import { useSearchParams } from 'next/navigation'

function FlashcardApp() {
  const searchParams = useSearchParams()
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    searchParams.get('lesson')
  )
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [showChunkSelector, setShowChunkSelector] = useState(false)
  const [lessonTotalWords, setLessonTotalWords] = useState(0)

  // Get lesson from URL params
  useEffect(() => {
    const lessonParam = searchParams.get('lesson')
    console.log('🔗 URL lesson param:', lessonParam)
    if (lessonParam !== selectedLessonId) {
      setSelectedLessonId(lessonParam)
    }
  }, [searchParams, selectedLessonId])

  // Fetch lessons
  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  // Fetch flashcards from API  
  const fetchFlashcards = useCallback(async () => {
    try {
      let url = '/api/flashcards'
      
      if (selectedLessonId) {
        // Check if it's a chunk ID
        if (selectedLessonId.includes('-chunk-')) {
          url = `/api/flashcards/chunk?id=${selectedLessonId}`
          setShowChunkSelector(false)
        } else {
          // First check lesson size to decide if we need chunk selector
          const countResponse = await fetch(`/api/flashcards?lesson=${selectedLessonId}`)
          if (countResponse.ok) {
            const allFlashcards = await countResponse.json()
            const wordCount = allFlashcards.length
            setLessonTotalWords(wordCount)
            
            // If lesson has more than 50 words, show chunk selector instead of loading all
            if (wordCount > 50) {
              setShowChunkSelector(true)
              setFlashcards([])
              setIsLoading(false)
              return
            }
          }
          
          url = `/api/flashcards?lesson=${selectedLessonId}`
          setShowChunkSelector(false)
        }
      } else {
        setShowChunkSelector(false)
      }

      console.log('🔍 Fetching flashcards:', { url, selectedLessonId })

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Received flashcards:', { count: data.length, lessonId: selectedLessonId })
        setFlashcards(data)
        setCurrentIndex(0) // Reset to first card when changing lessons
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedLessonId])

  // Call fetchFlashcards when component mounts or selectedLessonId changes
  useEffect(() => {
    fetchFlashcards()
  }, [fetchFlashcards])

  // Update selected lesson info when selectedLessonId changes
  useEffect(() => {
    if (selectedLessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === selectedLessonId)
      setSelectedLesson(lesson || null)
    } else {
      setSelectedLesson(null)
    }
  }, [selectedLessonId, lessons])

  const handleAddFlashcard = async (newFlashcard: {
    english: string
    vietnamese: string
    category: string
    difficulty: number
    lesson_id: string | null
  }) => {
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFlashcard),
      })

      if (response.ok) {
        const flashcard = await response.json()
        setFlashcards([flashcard, ...flashcards])
      }
    } catch (error) {
      console.error('Error adding flashcard:', error)
      throw error
    }
  }

  const nextCard = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }
  }

  const prevCard = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }
  }

  const resetProgress = () => {
    setCurrentIndex(0)
  }

  const handleChunkSelect = (chunkId: string) => {
    // Update URL with chunk ID and trigger flashcard fetch
    const url = new URL(window.location.href)
    url.searchParams.set('lesson', chunkId)
    window.history.pushState({}, '', url.toString())
    setSelectedLessonId(chunkId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải flashcards...</p>
        </div>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chưa có flashcard nào
          </h2>
          <p className="text-gray-600 mb-6">
            Hãy thêm từ vựng đầu tiên để bắt đầu học!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm từ đầu tiên
          </button>
        </div>

        {showAddForm && (
          <AddFlashcardForm
            onAdd={handleAddFlashcard}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Lesson Filter Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Học Flashcards
              </h2>
              {selectedLesson && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: selectedLesson.color + '20', color: selectedLesson.color }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedLesson.color }} />
                  {selectedLesson.name}
                </div>
              )}
              <div className="flex items-center gap-2">
                <a
                  href="/lessons"
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  📚 Browse All Lessons
                </a>
                <a
                  href="/grammar"
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  📝 Grammar Practice
                </a>
                <a
                  href="/study-plan"
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  📅 Study Plan
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Lesson Selector */}
              <select
                value={selectedLessonId || ''}
                onChange={(e) => {
                  const newLessonId = e.target.value || null
                  setSelectedLessonId(newLessonId)
                  // Update URL without reload
                  const url = new URL(window.location.href)
                  if (newLessonId) {
                    url.searchParams.set('lesson', newLessonId)
                  } else {
                    url.searchParams.delete('lesson')
                  }
                  window.history.pushState({}, '', url.toString())
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả bài học</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {showChunkSelector && selectedLessonId ? (
          <LessonChunksSelector
            lessonId={selectedLessonId}
            onChunkSelect={handleChunkSelect}
          />
        ) : flashcards.length === 0 && !showChunkSelector ? (
          <WelcomeDashboard
            onAddFlashcard={() => setShowAddForm(true)}
            selectedLessonId={selectedLessonId}
            selectedLessonName={selectedLesson?.name}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Học Tiếng Anh với Flashcards
              </h1>
              <p className="text-gray-600">
                Thẻ {currentIndex + 1} / {flashcards.length}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm từ mới
              </button>
              <button
                onClick={resetProgress}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Bắt đầu lại
              </button>
            </div>

            {/* Flashcard */}
            <div className="mb-8">
              <FlashcardComponent flashcard={currentCard} />
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <button
                onClick={prevCard}
                disabled={flashcards.length <= 1}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Trước
              </button>
              <button
                onClick={nextCard}
                disabled={flashcards.length <= 1}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / flashcards.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Add form modal */}
        {showAddForm && (
          <AddFlashcardForm
            onAdd={handleAddFlashcard}
            onClose={() => setShowAddForm(false)}
            selectedLessonId={selectedLessonId}
          />
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    }>
      <FlashcardApp />
    </Suspense>
  )
}

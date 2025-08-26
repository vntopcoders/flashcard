'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Lesson } from '@/types/flashcard'
import AudioButton from '@/components/AudioButton'
import WordImage from '@/components/WordImage'

interface AddFlashcardFormProps {
  onAdd: (flashcard: {
    english: string
    vietnamese: string
    category: string
    difficulty: number
    lesson_id: string | null
  }) => void
  onClose: () => void
  selectedLessonId?: string | null
}

export default function AddFlashcardForm({ onAdd, onClose, selectedLessonId }: AddFlashcardFormProps) {
  const [english, setEnglish] = useState('')
  const [vietnamese, setVietnamese] = useState('')
  const [category, setCategory] = useState('general')
  const [difficulty, setDifficulty] = useState(1)
  const [lessonId, setLessonId] = useState<string | null>(selectedLessonId || null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchLessons()
  }, [])

  useEffect(() => {
    setLessonId(selectedLessonId || null)
  }, [selectedLessonId])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!english.trim() || !vietnamese.trim()) {
      alert('Vui lòng nhập cả từ tiếng Anh và tiếng Việt')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onAdd({
        english: english.trim(),
        vietnamese: vietnamese.trim(),
        category,
        difficulty,
        lesson_id: lessonId
      })
      
      // Reset form
      setEnglish('')
      setVietnamese('')
      setCategory('general')
      setDifficulty(1)
      setLessonId(selectedLessonId || null)
      onClose()
    } catch (error) {
      console.error('Error adding flashcard:', error)
      alert('Có lỗi xảy ra khi thêm từ mới')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    'general',
    'business',
    'technology',
    'travel',
    'food',
    'education',
    'health',
    'sports'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Thêm từ mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="english" className="block text-sm font-medium text-gray-700 mb-1">
              Tiếng Anh *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="english"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-gray-900"
                placeholder="Nhập từ tiếng Anh..."
                required
              />
              {english && (
                <AudioButton 
                  word={english} 
                  size="md"
                  className="flex-shrink-0"
                />
              )}
            </div>
          </div>

          <div>
            <label htmlFor="vietnamese" className="block text-sm font-medium text-gray-700 mb-1">
              Tiếng Việt *
            </label>
            <input
              type="text"
              id="vietnamese"
              value={vietnamese}
              onChange={(e) => setVietnamese(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 text-gray-900"
              placeholder="Nhập nghĩa tiếng Việt..."
              required
            />
          </div>

          {/* Image Preview */}
          {english && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh minh họa
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <WordImage 
                  word={english} 
                  alt={`Preview image for ${english}`}
                  size="sm"
                />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Preview cho: &ldquo;{english}&rdquo;</p>
                  <p className="text-xs text-gray-500">Hình ảnh sẽ hiển thị khi lật thẻ</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="lesson" className="block text-sm font-medium text-gray-700 mb-1">
              Bài học
            </label>
            <select
              id="lesson"
              value={lessonId || ''}
              onChange={(e) => setLessonId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Không chọn bài học</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Độ khó (1-5)
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? 'Đang thêm...' : 'Thêm từ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface AddFlashcardFormProps {
  onAdd: (flashcard: {
    english: string
    vietnamese: string
    category: string
    difficulty: number
  }) => void
  onClose: () => void
}

export default function AddFlashcardForm({ onAdd, onClose }: AddFlashcardFormProps) {
  const [english, setEnglish] = useState('')
  const [vietnamese, setVietnamese] = useState('')
  const [category, setCategory] = useState('general')
  const [difficulty, setDifficulty] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        difficulty
      })
      
      // Reset form
      setEnglish('')
      setVietnamese('')
      setCategory('general')
      setDifficulty(1)
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
            <input
              type="text"
              id="english"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập từ tiếng Anh..."
              required
            />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập nghĩa tiếng Việt..."
              required
            />
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

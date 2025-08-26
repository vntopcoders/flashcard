'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Book, X } from 'lucide-react'
import { Lesson } from '@/types/flashcard'
import Link from 'next/link'

interface LessonWithCount extends Lesson {
  flashcard_count: number
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonWithCount[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonWithCount | null>(null)
  const [deletingLesson, setDeletingLesson] = useState<LessonWithCount | null>(null)
  const [confirmCode, setConfirmCode] = useState('')
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ]

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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingLesson ? 'PUT' : 'POST'
      const url = editingLesson ? `/api/lessons/${editingLesson.id}` : '/api/lessons'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchLessons()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
    }
  }

  const handleDelete = async (lesson: LessonWithCount) => {
    setDeletingLesson(lesson)
    setConfirmCode('')
  }

  const handleForceDelete = async () => {
    if (!deletingLesson) return
    
    // Generate expected confirmation code (lesson name in uppercase)
    const expectedCode = deletingLesson.name.toUpperCase()
    
    if (confirmCode !== expectedCode) {
      alert(`❌ Mã xác nhận không đúng!\n\nVui lòng nhập: ${expectedCode}`)
      return
    }

    try {
      console.log('🔄 Force deleting lesson:', deletingLesson.name)
      const response = await fetch(`/api/lessons/${deletingLesson.id}?force=true`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const responseData = await response.json()
      console.log('📡 Server response:', responseData)

      if (response.ok) {
        console.log('✅ Force delete successful')
        await fetchLessons()
        alert(`✅ Đã xóa bài học "${deletingLesson.name}" và tất cả flashcards thành công!`)
        setDeletingLesson(null)
        setConfirmCode('')
      } else {
        console.error('❌ Force delete failed:', responseData)
        alert(`❌ Lỗi: ${responseData.error || 'Không thể xóa bài học'}`)
      }
    } catch (error) {
      console.error('❌ Force delete error:', error)
      alert('❌ Có lỗi xảy ra khi xóa bài học')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3B82F6' })
    setIsCreateModalOpen(false)
    setEditingLesson(null)
  }

  const openEditModal = (lesson: LessonWithCount) => {
    setFormData({
      name: lesson.name,
      description: lesson.description || '',
      color: lesson.color
    })
    setEditingLesson(lesson)
    setIsCreateModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài học...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Book className="w-6 h-6" />
              Quản lý Bài học
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tạo bài học mới
            </button>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: lesson.color }}
                  />
                  <h3 className="font-semibold text-gray-900">{lesson.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(lesson)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson)}
                    className={`
                      p-1.5 rounded transition-colors
                      ${lesson.flashcard_count > 0 
                        ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      }
                    `}
                    title={lesson.flashcard_count > 0 
                      ? `Không thể xóa - còn ${lesson.flashcard_count} flashcard(s)` 
                      : 'Xóa bài học này'
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {lesson.description && (
                <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {lesson.flashcard_count} flashcard{lesson.flashcard_count !== 1 ? 's' : ''}
                </span>
                <Link
                  href={`/?lesson=${lesson.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Học ngay →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có bài học nào
            </h2>
            <p className="text-gray-600 mb-6">
              Tạo bài học đầu tiên để bắt đầu tổ chức flashcards
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tạo bài học đầu tiên
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingLesson ? 'Sửa Bài học' : 'Tạo Bài học Mới'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên bài học *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: Từ vựng cơ bản"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Mô tả ngắn về bài học này..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu sắc
                  </label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingLesson ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ⚠️ Xóa bài học "{deletingLesson.name}"
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  {deletingLesson.flashcard_count > 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 font-medium">
                        ⚠️ Bài học này có {deletingLesson.flashcard_count} flashcard(s)
                      </p>
                      <p className="text-yellow-700 mt-1">
                        Tất cả flashcards sẽ bị xóa cùng với bài học!
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">Bài học này không có flashcards nào.</p>
                  )}
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Để xác nhận, vui lòng nhập tên bài học:
                  </label>
                  <div className="bg-gray-100 px-3 py-2 rounded mb-2 font-mono text-sm">
                    {deletingLesson.name.toUpperCase()}
                  </div>
                  <input
                    type="text"
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                    placeholder="Nhập mã xác nhận..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeletingLesson(null)
                    setConfirmCode('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleForceDelete}
                  disabled={confirmCode !== deletingLesson.name.toUpperCase()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  🗑️ Xóa ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

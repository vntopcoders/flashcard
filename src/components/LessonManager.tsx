'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Book, X } from 'lucide-react'
import { Lesson } from '@/types/flashcard'

interface LessonWithCount extends Lesson {
  flashcard_count: number
}

interface LessonManagerProps {
  selectedLessonId: string | null
  onLessonSelect: (lessonId: string | null) => void
}

export default function LessonManager({ selectedLessonId, onLessonSelect }: LessonManagerProps) {
  const [lessons, setLessons] = useState<LessonWithCount[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonWithCount | null>(null)
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
    if (lesson.flashcard_count > 0) {
      alert('Cannot delete lesson that contains flashcards')
      return
    }

    if (confirm(`Are you sure you want to delete "${lesson.name}"?`)) {
      try {
        const response = await fetch(`/api/lessons/${lesson.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchLessons()
          if (selectedLessonId === lesson.id) {
            onLessonSelect(null)
          }
        }
      } catch (error) {
        console.error('Error deleting lesson:', error)
      }
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
    return <div className="p-4 text-center">Loading lessons...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Book className="w-5 h-5" />
          Lessons
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Lesson
        </button>
      </div>

      {/* Lesson Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onLessonSelect(null)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLessonId === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All Lessons
          </button>
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedLessonId === lesson.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              style={{
                backgroundColor: selectedLessonId === lesson.id ? lesson.color : undefined
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: lesson.color }}
              />
              {lesson.name}
              <span className="text-xs opacity-75">({lesson.flashcard_count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: lesson.color }}
              />
              <div>
                <h3 className="font-medium text-gray-900">{lesson.name}</h3>
                {lesson.description && (
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                )}
                <p className="text-xs text-gray-500">{lesson.flashcard_count} flashcards</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(lesson)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(lesson)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                disabled={lesson.flashcard_count > 0}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
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
                  Lesson Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-900' : 'border-gray-300'
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingLesson ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

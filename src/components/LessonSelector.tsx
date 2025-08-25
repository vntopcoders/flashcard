'use client'

import { useState, useEffect } from 'react'
import { Lesson } from '@/types/flashcard'

interface LessonWithCount extends Lesson {
  flashcard_count: number
}

interface LessonSelectorProps {
  selectedLessonId: string | null
  onLessonSelect: (lessonId: string | null) => void
  className?: string
}

export default function LessonSelector({ selectedLessonId, onLessonSelect, className = '' }: LessonSelectorProps) {
  const [lessons, setLessons] = useState<LessonWithCount[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <select disabled className={`opacity-50 ${className}`}>
        <option>Đang tải...</option>
      </select>
    )
  }

  return (
    <select
      value={selectedLessonId || ''}
      onChange={(e) => onLessonSelect(e.target.value || null)}
      className={className}
    >
      <option value="">Tất cả bài học</option>
      {lessons.map((lesson) => (
        <option key={lesson.id} value={lesson.id}>
          {lesson.name} ({lesson.flashcard_count})
        </option>
      ))}
    </select>
  )
}

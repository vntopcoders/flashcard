'use client'

import { Plus, BookOpen, Target, Zap } from 'lucide-react'
import Link from 'next/link'

interface WelcomeDashboardProps {
  onAddFlashcard: () => void
  selectedLessonId: string | null
  selectedLessonName?: string
}

export default function WelcomeDashboard({ onAddFlashcard, selectedLessonId, selectedLessonName }: WelcomeDashboardProps) {
  const features = [
    {
      icon: BookOpen,
      title: 'Tổ chức theo bài học',
      description: 'Chia flashcards thành các bài học riêng biệt để học hiệu quả hơn'
    },
    {
      icon: Target,
      title: 'Học có mục tiêu',
      description: 'Chọn bài học cụ thể để tập trung vào từ vựng cần thiết'
    },
    {
      icon: Zap,
      title: 'Ghi nhớ nhanh chóng',
      description: 'Phương pháp flashcard giúp ghi nhớ từ vựng lâu dài'
    }
  ]

  return (
    <div className="text-center py-12">
      <div className="mb-12">
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {selectedLessonId 
            ? `Bài học "${selectedLessonName}" chưa có flashcard nào` 
            : 'Chào mừng đến với English Flashcards!'}
        </h2>
        <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
          {selectedLessonId 
            ? 'Hãy thêm flashcard đầu tiên cho bài học này để bắt đầu học'
            : 'Bắt đầu hành trình học tiếng Anh hiệu quả với hệ thống flashcard thông minh'}
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={onAddFlashcard}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            {selectedLessonId ? 'Thêm flashcard cho bài này' : 'Thêm flashcard đầu tiên'}
          </button>
          
          {!selectedLessonId && (
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              <BookOpen className="w-5 h-5" />
              Tạo bài học mới
            </Link>
          )}
        </div>
      </div>

      {!selectedLessonId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          💡 Mẹo học hiệu quả
        </h3>
        <p className="text-blue-700">
          Học 10-15 từ mỗi ngày và ôn tập thường xuyên. 
          Flashcard giúp não bộ ghi nhớ từ vựng tốt hơn thông qua việc lặp lại có khoảng cách.
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'

interface GrammarTopic {
  id: string
  title: string
  theory_vietnamese: string
  keyPoints: Array<{
    id: string
    point_vietnamese: string
    example_sentence?: string
  }>
}

interface GrammarWeekData {
  weekNumber: number
  topics: GrammarTopic[]
  lessonLinks: string[]
  grammarLinks: string[]
}

interface GrammarWeekContentProps {
  weekNumber: number
}

export default function GrammarWeekContent({ weekNumber }: GrammarWeekContentProps) {
  const [grammarData, setGrammarData] = useState<GrammarWeekData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGrammarData()
  }, [weekNumber])

  const loadGrammarData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/grammar/week/${weekNumber}`)
      const result = await response.json()
      
      if (result.success) {
        setGrammarData(result.data)
      }
    } catch (error) {
      console.error('Failed to load grammar data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!grammarData || grammarData.topics.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        Chưa có dữ liệu grammar cho tuần này
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Grammar Topics */}
      {grammarData.topics.map((topic) => (
        <div key={topic.id}>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            📚 {topic.title}
          </h4>
          <p className="text-sm text-gray-700 mb-3">{topic.theory_vietnamese}</p>
          
          {topic.keyPoints && topic.keyPoints.length > 0 && (
            <div className="space-y-2">
              {topic.keyPoints.map((point) => (
                <div key={point.id} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <span className="text-sm text-gray-700">{point.point_vietnamese}</span>
                    {point.example_sentence && (
                      <div className="text-xs text-gray-500 mt-1 italic">
                        Ví dụ: {point.example_sentence}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Study Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lesson Links */}
        {grammarData.lessonLinks && grammarData.lessonLinks.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              📖 Lesson Links
            </h4>
            <div className="space-y-2">
              {grammarData.lessonLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Lesson {index + 1}
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Grammar Links */}
        {grammarData.grammarLinks && grammarData.grammarLinks.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              🔤 Grammar Links
            </h4>
            <div className="space-y-2">
              {grammarData.grammarLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Grammar {index + 1}
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
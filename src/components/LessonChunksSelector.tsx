'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Play, CheckCircle, Users } from 'lucide-react'

interface LessonChunk {
  id: string
  name: string
  description: string
  color: string
  flashcard_count: number
  chunk_number: number
  total_chunks: number
  parent_lesson: {
    id: string
    name: string
    description: string
    color: string
  }
}

interface Props {
  lessonId: string
  onChunkSelect: (chunkId: string) => void
  selectedChunkId?: string
}

export default function LessonChunksSelector({ lessonId, onChunkSelect, selectedChunkId }: Props) {
  const [chunks, setChunks] = useState<LessonChunk[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChunks()
  }, [lessonId])

  const fetchChunks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/lessons/${lessonId}/chunks?size=20`)
      if (response.ok) {
        const data = await response.json()
        setChunks(data)
      } else {
        setError('Failed to load lesson chunks')
      }
    } catch (error) {
      console.error('Error fetching chunks:', error)
      setError('Error loading lesson chunks')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (chunks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-600">
          <p>No lesson chunks available</p>
        </div>
      </div>
    )
  }

  const parentLesson = chunks[0].parent_lesson

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: parentLesson.color }}
          />
          <h2 className="text-xl font-semibold text-gray-900">
            {parentLesson.name}
          </h2>
        </div>
        <p className="text-gray-600 mb-4">{parentLesson.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {chunks.reduce((sum, chunk) => sum + chunk.flashcard_count, 0)} total words
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {chunks.length} study parts
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-800 mb-4">Choose a study part (20 words each):</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {chunks.map((chunk) => (
            <button
              key={chunk.id}
              onClick={() => onChunkSelect(chunk.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                selectedChunkId === chunk.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chunk.color }}
                  />
                  <span className="font-medium text-gray-900">
                    Part {chunk.chunk_number}
                  </span>
                </div>
                {selectedChunkId === chunk.id && (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
              </div>
              
              <div className="text-left">
                <div className="text-sm text-gray-600 mb-1">
                  {chunk.flashcard_count} words
                </div>
                <div className="text-xs text-gray-500">
                  ~{Math.ceil(chunk.flashcard_count / 10)} min study
                </div>
              </div>
              
              {selectedChunkId === chunk.id && (
                <div className="mt-2 flex items-center gap-1 text-blue-600 text-xs">
                  <Play className="w-3 h-3" />
                  Ready to study
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">💡</div>
          <div className="text-sm text-blue-800">
            <strong>Study Tip:</strong> Each part contains 20 words for optimal learning. 
            Complete one part before moving to the next for better retention.
          </div>
        </div>
      </div>
    </div>
  )
}
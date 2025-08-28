'use client'

import React, { useState } from 'react'
import { BookOpen, Clock, Star } from 'lucide-react'
import PronunciationPlayer from './PronunciationPlayer'

interface VocabularyCardProps {
  word: string
  vietnamese: string
  ipa?: string
  definition?: string
  example?: string
  category?: string
  difficulty?: number
  isLearned?: boolean
  showPronunciation?: boolean
  onStudy?: () => void
  onMarkLearned?: () => void
}

export default function VocabularyCard({
  word,
  vietnamese,
  ipa,
  definition,
  example,
  category,
  difficulty = 1,
  isLearned = false,
  showPronunciation = true,
  onStudy,
  onMarkLearned
}: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const difficultyColors = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-yellow-100 text-yellow-700',
    3: 'bg-orange-100 text-orange-700',
    4: 'bg-red-100 text-red-700',
    5: 'bg-purple-100 text-purple-700'
  }

  const difficultyLabels = {
    1: 'Beginner',
    2: 'Elementary', 
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div 
        className={`
          min-h-48 p-6 cursor-pointer transition-all duration-500
          ${isFlipped ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-white'}
        `}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {!isFlipped ? (
          // Front Side - English Word
          <div className="text-center h-full flex flex-col justify-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {word}
              </h3>
              {showPronunciation && (
                <PronunciationPlayer 
                  text={word}
                  type="word"
                  size="medium"
                  showAccentSelector={true}
                />
              )}
            </div>
            
            {ipa && (
              <div className="text-gray-600 mb-4">
                <span className="text-sm font-medium">/{ipa}/</span>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 mb-4">
              {category && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  {category}
                </span>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
                {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
              </span>
              {isLearned && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>

            <p className="text-sm text-gray-500">
              Tap to see meaning
            </p>
          </div>
        ) : (
          // Back Side - Vietnamese & Details
          <div className="text-center h-full flex flex-col justify-center space-y-4">
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                {vietnamese}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-lg font-medium text-gray-700">
                  {word}
                </span>
                {showPronunciation && (
                  <PronunciationPlayer 
                    text={word}
                    type="word"
                    size="small"
                  />
                )}
              </div>
            </div>

            {definition && (
              <div className="text-sm text-gray-600 mb-3">
                <strong>Definition:</strong> {definition}
              </div>
            )}

            {example && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Example:</strong>
                </div>
                <div className="flex items-start gap-2">
                  <p className="text-sm italic flex-1">
                    {example}
                  </p>
                  {showPronunciation && (
                    <PronunciationPlayer 
                      text={example}
                      type="sentence"
                      size="small"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Study time: ~2min</span>
          </div>
          
          <div className="flex gap-2">
            {onStudy && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onStudy()
                }}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                Study
              </button>
            )}
            
            {onMarkLearned && !isLearned && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkLearned()
                }}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
              >
                <Star className="w-4 h-4" />
                Learned
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
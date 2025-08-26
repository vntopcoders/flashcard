'use client'

import { useState } from 'react'
import { Flashcard } from '@/types/flashcard'
import AudioButton from '@/components/AudioButton'
import WordImage from '@/components/WordImage'

interface FlashcardComponentProps {
  flashcard: Flashcard
}

export default function FlashcardComponent({ flashcard }: FlashcardComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-blue-100 text-blue-800'
      case 3: return 'bg-yellow-100 text-yellow-800'
      case 4: return 'bg-orange-100 text-orange-800'
      case 5: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="relative w-full h-80 cursor-pointer preserve-3d transition-transform duration-700"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
        onClick={handleFlip}
      >
        {/* Front side - English */}
        <div className="absolute inset-0 w-full h-full bg-white border-2 border-blue-200 rounded-xl shadow-lg flex flex-col justify-center items-center p-6 backface-hidden">
          <div className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${getDifficultyColor(flashcard.difficulty)}`}>
            Level {flashcard.difficulty}
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-blue-600 text-center">
              {flashcard.english}
            </h2>
            <AudioButton 
              word={flashcard.english} 
              size="md"
              className="flex-shrink-0"
            />
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            English
          </p>
          <div className="absolute bottom-4 text-xs text-gray-400">
            Click to flip
          </div>
        </div>

        {/* Back side - Vietnamese */}
        <div 
          className="absolute inset-0 w-full h-full bg-white border-2 border-green-200 rounded-xl shadow-lg flex flex-col justify-center items-center p-6 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="px-3 py-1 rounded-full text-xs font-medium mb-3 bg-green-100 text-green-800">
            {flashcard.category}
          </div>
          
          {/* Image for the word */}
          <div className="mb-3">
            <WordImage 
              word={flashcard.english} 
              alt={`Image for ${flashcard.english}`}
              size="md"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-green-600 text-center mb-2">
            {flashcard.vietnamese}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Tiếng Việt
          </p>
          <div className="absolute bottom-4 text-xs text-gray-400">
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  )
}

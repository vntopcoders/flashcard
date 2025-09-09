'use client'

import { useState } from 'react'
import { Flashcard, ExampleSentence, Collocation } from '@/types/flashcard'
import AudioButton from '@/components/AudioButton'
import WordImage from '@/components/WordImage'
import { BookOpen, Lightbulb, Clock, TrendingUp, Volume2, ChevronDown, ChevronUp, Star, Target, Brain, History } from 'lucide-react'

interface EnhancedFlashcardComponentProps {
  flashcard: Flashcard
  onStudyComplete?: (correct: boolean) => void
  showProgress?: boolean
}

export default function EnhancedFlashcardComponent({ 
  flashcard, 
  onStudyComplete,
  showProgress = true 
}: EnhancedFlashcardComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTab, setActiveTab] = useState<'meaning' | 'examples' | 'collocations' | 'tips'>('meaning')
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleStudyResponse = (correct: boolean) => {
    onStudyComplete?.(correct)
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800 border-green-200'
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200'
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200'
      case 5: return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'new': return 'bg-gray-100 text-gray-700'
      case 'learning': return 'bg-blue-100 text-blue-700'
      case 'familiar': return 'bg-yellow-100 text-yellow-700'
      case 'mastered': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSuccessRate = () => {
    const total = flashcard.times_correct + flashcard.times_wrong
    return total > 0 ? Math.round((flashcard.times_correct / total) * 100) : 0
  }

  // Parse JSON fields
  const examples: ExampleSentence[] = flashcard.examples ? 
    (typeof flashcard.examples === 'string' ? JSON.parse(flashcard.examples) : flashcard.examples) : []
  
  const collocations: Collocation[] = flashcard.collocations ? 
    (typeof flashcard.collocations === 'string' ? JSON.parse(flashcard.collocations) : flashcard.collocations) : []
  
  const synonyms: string[] = flashcard.synonyms ? 
    (typeof flashcard.synonyms === 'string' ? JSON.parse(flashcard.synonyms) : flashcard.synonyms) : []
  
  const antonyms: string[] = flashcard.antonyms ? 
    (typeof flashcard.antonyms === 'string' ? JSON.parse(flashcard.antonyms) : flashcard.antonyms) : []

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Stats */}
      {showProgress && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(flashcard.mastery_level)}`}>
                <Star className="w-3 h-3 inline mr-1" />
                {flashcard.mastery_level}
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Target className="w-3 h-3" />
                {getSuccessRate()}% accuracy
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <TrendingUp className="w-3 h-3" />
                {flashcard.times_studied} studies
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(flashcard.difficulty)}`}>
              Level {flashcard.difficulty}
            </div>
          </div>
        </div>
      )}

      <div
        className="relative w-full min-h-96 cursor-pointer preserve-3d transition-transform duration-700"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
        onClick={handleFlip}
      >
        {/* Front side - English */}
        <div className="absolute inset-0 w-full h-full bg-white border-2 border-blue-200 rounded-xl shadow-lg backface-hidden">
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">{flashcard.category}</span>
              </div>
              {flashcard.next_review && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Next: {new Date(flashcard.next_review).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Main Word */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-bold text-blue-600 text-center">
                  {flashcard.english}
                </h2>
                <AudioButton
                  word={flashcard.english}
                  size="lg"
                  className="flex-shrink-0"
                />
              </div>

              {/* IPA Pronunciation */}
              {flashcard.ipa && (
                <p className="text-xl text-gray-600 mb-4 font-mono bg-gray-50 px-3 py-1 rounded">
                  /{flashcard.ipa}/
                </p>
              )}

              {/* Quick Examples Preview */}
              {examples.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 max-w-md">
                  <p className="text-sm text-blue-800 italic">
                    &ldquo;{examples[0].sentence}&rdquo;
                  </p>
                  {examples.length > 1 && (
                    <p className="text-xs text-blue-600 mt-1">
                      +{examples.length - 1} more examples
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Click to see meaning & examples</p>
              <div className="flex justify-center">
                <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Back side - Vietnamese + Enhanced Content */}
        <div
          className="absolute inset-0 w-full h-full bg-white border-2 border-green-200 rounded-xl shadow-lg backface-hidden overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="h-full flex flex-col">
            {/* Header Tabs */}
            <div className="flex border-b bg-gray-50">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('meaning') }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'meaning' 
                    ? 'border-b-2 border-green-500 text-green-600 bg-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-1" />
                Meaning
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('examples') }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'examples' 
                    ? 'border-b-2 border-green-500 text-green-600 bg-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Volume2 className="w-4 h-4 inline mr-1" />
                Examples ({examples.length})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('collocations') }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'collocations' 
                    ? 'border-b-2 border-green-500 text-green-600 bg-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Brain className="w-4 h-4 inline mr-1" />
                Usage ({collocations.length})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('tips') }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'tips' 
                    ? 'border-b-2 border-green-500 text-green-600 bg-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Lightbulb className="w-4 h-4 inline mr-1" />
                Tips
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'meaning' && (
                <div className="space-y-4">
                  {/* Main Translation */}
                  <div className="text-center">
                    <WordImage
                      word={flashcard.english}
                      alt={`Image for ${flashcard.english}`}
                      size="lg"
                      className="mx-auto mb-4"
                    />
                    <h2 className="text-3xl font-bold text-green-600 mb-2">
                      {flashcard.vietnamese}
                    </h2>
                  </div>

                  {/* Synonyms & Antonyms */}
                  <div className="grid grid-cols-2 gap-4">
                    {synonyms.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Synonyms:</h4>
                        <div className="flex flex-wrap gap-1">
                          {synonyms.map((word, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {antonyms.length > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">Antonyms:</h4>
                        <div className="flex flex-wrap gap-1">
                          {antonyms.map((word, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-4">
                  {examples.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-green-700">Example Sentences</h3>
                        <span className="text-sm text-gray-500">
                          {currentExampleIndex + 1} of {examples.length}
                        </span>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border">
                        <div className="flex items-start gap-3 mb-3">
                          <p className="text-gray-800 flex-1">
                            {examples[currentExampleIndex].sentence}
                          </p>
                          <AudioButton
                            word={examples[currentExampleIndex].sentence}
                            size="sm"
                          />
                        </div>
                        <p className="text-gray-600 text-sm border-t pt-2">
                          🇻🇳 {examples[currentExampleIndex].translation}
                        </p>
                        {examples[currentExampleIndex].context && (
                          <p className="text-blue-600 text-xs mt-1 italic">
                            Context: {examples[currentExampleIndex].context}
                          </p>
                        )}
                      </div>

                      {examples.length > 1 && (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentExampleIndex(Math.max(0, currentExampleIndex - 1))
                            }}
                            disabled={currentExampleIndex === 0}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentExampleIndex(Math.min(examples.length - 1, currentExampleIndex + 1))
                            }}
                            disabled={currentExampleIndex === examples.length - 1}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No examples available yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'collocations' && (
                <div className="space-y-3">
                  {collocations.length > 0 ? (
                    <>
                      <h3 className="text-lg font-semibold text-green-700">Common Usage</h3>
                      {collocations.map((collocation, idx) => (
                        <div key={idx} className="bg-purple-50 p-3 rounded-lg border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-purple-800">
                              {collocation.phrase}
                            </span>
                            <AudioButton word={collocation.phrase} size="sm" />
                          </div>
                          <p className="text-gray-700 text-sm mb-1">{collocation.meaning}</p>
                          <p className="text-purple-600 text-sm italic">&ldquo;{collocation.example}&rdquo;</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Brain className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No collocations available yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-4">
                  {flashcard.memory_tips && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Memory Tips
                      </h4>
                      <p className="text-gray-700">{flashcard.memory_tips}</p>
                    </div>
                  )}

                  {flashcard.etymology && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Etymology
                      </h4>
                      <p className="text-gray-700">{flashcard.etymology}</p>
                    </div>
                  )}

                  {!flashcard.memory_tips && !flashcard.etymology && (
                    <div className="text-center text-gray-500 py-8">
                      <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No memory tips available yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Study Response Buttons */}
            {onStudyComplete && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStudyResponse(false) }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Need More Practice
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStudyResponse(true) }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Got It!
                  </button>
                </div>
              </div>
            )}

            <div className="text-center p-2">
              <ChevronUp className="w-4 h-4 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-400">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
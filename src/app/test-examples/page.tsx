'use client'

import { useState, useEffect } from 'react'
import EnhancedFlashcardComponent from '@/components/EnhancedFlashcardComponent'
import { Flashcard } from '@/types/flashcard'

export default function TestExamplesPage() {
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestFlashcard = async () => {
      try {
        // Get first flashcard with examples
        const response = await fetch('/api/flashcards')
        const flashcards = await response.json()
        
        console.log('All flashcards:', flashcards)
        
        // Find a flashcard with examples
        const cardWithExamples = flashcards.find((card: any) => 
          card.examples && card.examples !== 'null' && card.examples !== null
        )
        
        console.log('Card with examples:', cardWithExamples)
        
        if (cardWithExamples) {
          // Try to parse examples
          let parsedExamples = null
          if (typeof cardWithExamples.examples === 'string') {
            try {
              parsedExamples = JSON.parse(cardWithExamples.examples)
              console.log('Parsed examples:', parsedExamples)
            } catch (e) {
              console.error('Failed to parse examples:', e)
              console.log('Raw examples:', cardWithExamples.examples)
            }
          }
          
          setFlashcard(cardWithExamples)
        } else {
          setError('No flashcard with examples found')
        }
      } catch (err) {
        console.error('Error fetching flashcard:', err)
        setError('Failed to fetch flashcard')
      } finally {
        setLoading(false)
      }
    }

    fetchTestFlashcard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test flashcard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!flashcard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No flashcard available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🐛 Examples Debug Page
          </h1>
          <p className="text-gray-600">Testing examples display functionality</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flashcard */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Enhanced Flashcard Component</h2>
            <EnhancedFlashcardComponent flashcard={flashcard} />
          </div>

          {/* Debug Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Word:</h3>
                <p className="text-gray-700">{flashcard.english} - {flashcard.vietnamese}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Raw Examples (from API):</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(flashcard.examples, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Examples Type:</h3>
                <p className="text-gray-700">{typeof flashcard.examples}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Parsed Examples:</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {(() => {
                    try {
                      const parsed = flashcard.examples ? 
                        (typeof flashcard.examples === 'string' ? JSON.parse(flashcard.examples) : flashcard.examples) : []
                      return JSON.stringify(parsed, null, 2)
                    } catch (e) {
                      return `Parse Error: ${e}`
                    }
                  })()}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
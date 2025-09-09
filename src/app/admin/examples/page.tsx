'use client'

import { useState } from 'react'
import { Plus, Check, X, RefreshCw } from 'lucide-react'

export default function AdminExamplesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Array<{word: string, status: string, exampleCount?: number, error?: string}>>([])
  const [availableWords, setAvailableWords] = useState<string[]>([])

  const loadAvailableWords = async () => {
    try {
      const response = await fetch('/api/flashcards/bulk-update-examples')
      const data = await response.json()
      setAvailableWords(data.words || [])
    } catch (error) {
      console.error('Error loading available words:', error)
    }
  }

  const addSampleExamples = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/flashcards/bulk-update-examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add-sample-examples'
        })
      })

      const data = await response.json()
      setResults(data.results || [])
      
      if (data.success) {
        alert(`✅ Successfully processed ${data.results.length} words!`)
      }
    } catch (error) {
      console.error('Error adding examples:', error)
      alert('❌ Error adding examples')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'updated':
        return <Check className="w-4 h-4 text-green-600" />
      case 'not_found':
        return <X className="w-4 h-4 text-yellow-600" />
      case 'failed':
      case 'error':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <RefreshCw className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'updated':
        return 'bg-green-50 text-green-800'
      case 'not_found':
        return 'bg-yellow-50 text-yellow-800'
      case 'failed':
      case 'error':
        return 'bg-red-50 text-red-800'
      default:
        return 'bg-gray-50 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              📚 Admin: Bulk Add Examples
            </h1>
            <p className="text-gray-600">
              Thêm ví dụ câu cho các từ vựng đã có trong database
            </p>
          </div>

          <div className="space-y-6">
            {/* Load Available Words */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                📋 Available Sample Examples
              </h3>
              <button
                onClick={loadAvailableWords}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load Available Words
              </button>
              
              {availableWords.length > 0 && (
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm text-gray-600 mb-2">
                    Available words with pre-written examples: {availableWords.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableWords.map((word) => (
                      <span
                        key={word}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Add Sample Examples */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                ⚡ Bulk Add Sample Examples
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tự động thêm ví dụ câu có sẵn cho các từ trong database
              </p>
              
              <button
                onClick={addSampleExamples}
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Sample Examples
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4">
                  📊 Results ({results.length} words processed)
                </h3>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border flex items-center justify-between ${getStatusColor(result.status)}`}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.word}</span>
                        {result.exampleCount && (
                          <span className="text-xs bg-white px-2 py-1 rounded">
                            {result.exampleCount} examples
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <span className="capitalize font-medium">
                          {result.status.replace('_', ' ')}
                        </span>
                        {result.error && (
                          <div className="text-xs text-red-600 mt-1">
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-green-800 font-bold">
                        {results.filter(r => r.status === 'updated').length}
                      </div>
                      <div className="text-green-600 text-xs">Updated</div>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <div className="text-yellow-800 font-bold">
                        {results.filter(r => r.status === 'not_found').length}
                      </div>
                      <div className="text-yellow-600 text-xs">Not Found</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <div className="text-red-800 font-bold">
                        {results.filter(r => r.status === 'failed' || r.status === 'error').length}
                      </div>
                      <div className="text-red-600 text-xs">Failed</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-800 font-bold">
                        {results.length}
                      </div>
                      <div className="text-gray-600 text-xs">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Instructions */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-blue-800 mb-3">
                📝 Manual Instructions
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>Cách 1:</strong> Sử dụng nút &ldquo;Add Sample Examples&rdquo; để tự động thêm ví dụ có sẵn</p>
                <p><strong>Cách 2:</strong> Vào từng flashcard và thêm examples thủ công qua form &ldquo;Thêm từ mới&rdquo;</p>
                <p><strong>Cách 3:</strong> Sử dụng API endpoint trực tiếp:</p>
                <code className="block bg-white p-2 rounded mt-2 text-xs">
                  POST /api/flashcards/bulk-update-examples<br/>
                  {`{"action": "add-sample-examples"}`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
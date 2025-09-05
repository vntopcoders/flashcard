'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

export default function TestTTSPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')

  const testText = `Part 1: Conversation - Photography Course Enrollment
Receptionist: Good morning, Community Learning Center. How can I help you?
Sarah: Hello, I'm calling about the photography classes. I saw your advertisement in the local newspaper.`

  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices()
    console.log('Available voices:', availableVoices)
    setVoices(availableVoices)
    
    // Auto-select a good English voice
    const englishVoice = availableVoices.find(voice => 
      voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    ) || availableVoices.find(voice => voice.lang.startsWith('en'))
    
    if (englishVoice) {
      setSelectedVoice(englishVoice.name)
    }
  }

  const testTTS = () => {
    if (!('speechSynthesis' in window)) {
      setError('Trình duyệt không hỗ trợ Web Speech API')
      return
    }

    try {
      setError(null)
      
      if (isPlaying) {
        speechSynthesis.cancel()
        setIsPlaying(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(testText)
      utterance.rate = 1.0
      utterance.volume = 1.0
      utterance.lang = 'en-US'

      // Use selected voice
      if (selectedVoice) {
        const voice = voices.find(v => v.name === selectedVoice)
        if (voice) {
          utterance.voice = voice
        }
      }

      utterance.onstart = () => {
        console.log('TTS started')
        setIsPlaying(true)
      }

      utterance.onend = () => {
        console.log('TTS ended')
        setIsPlaying(false)
      }

      utterance.onerror = (event) => {
        console.error('TTS error:', event)
        setError('Lỗi TTS: ' + event.error)
        setIsPlaying(false)
      }

      console.log('Starting TTS with utterance:', utterance)
      speechSynthesis.speak(utterance)

    } catch (error) {
      console.error('TTS test error:', error)
      setError('Lỗi: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Load voices on component mount and when voices change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      loadVoices()
      speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🎙️ TTS Testing Page</h1>
      
      {/* Browser Support Check */}
      <div className="mb-6 p-4 rounded-lg bg-gray-100">
        <h2 className="font-semibold mb-2">Browser Support</h2>
        <p>
          speechSynthesis: {typeof window !== 'undefined' && 'speechSynthesis' in window ? '✅ Supported' : '❌ Not supported'}
        </p>
        <p>Voices loaded: {voices.length}</p>
      </div>

      {/* Voice Selection */}
      {voices.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50">
          <h2 className="font-semibold mb-2">Select Voice</h2>
          <select 
            value={selectedVoice} 
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Default Voice</option>
            {voices
              .filter(voice => voice.lang.startsWith('en'))
              .map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            }
          </select>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Test Text */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <h2 className="font-semibold mb-2">Test Text</h2>
        <p className="text-sm text-gray-700">{testText}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={testTTS}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${
            isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Stop TTS' : 'Test TTS'}
        </button>

        <button
          onClick={loadVoices}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Volume2 className="w-5 h-5" />
          Reload Voices ({voices.length})
        </button>
      </div>

      {/* Debug Info */}
      <div className="p-4 rounded-lg bg-gray-100 text-xs">
        <h2 className="font-semibold mb-2">Debug Info</h2>
        <pre className="whitespace-pre-wrap">
{JSON.stringify({
  speechSynthesisSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  voicesCount: voices.length,
  selectedVoice: selectedVoice,
  isPlaying: isPlaying,
  currentError: error
}, null, 2)}
        </pre>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Play, Pause } from 'lucide-react'

export default function TestListeningDebug() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testTranscript = `Part 1: Conversation - Photography Course Enrollment
Receptionist: Good morning, Community Learning Center. How can I help you?
Sarah: Hello, I'm calling about the photography classes. I saw your advertisement in the local newspaper.`

  const testTTS = async () => {
    console.log('🎵 Test TTS clicked')
    
    if (!('speechSynthesis' in window)) {
      setError('Browser does not support TTS')
      return
    }

    try {
      if (isPlaying) {
        console.log('⏹️ Stopping TTS')
        speechSynthesis.cancel()
        setIsPlaying(false)
        return
      }

      console.log('🎙️ Starting TTS with text:', testTranscript.substring(0, 50) + '...')
      
      speechSynthesis.cancel() // Clear any existing speech
      
      const utterance = new SpeechSynthesisUtterance(testTranscript)
      utterance.rate = 1.0
      utterance.volume = 1.0
      utterance.lang = 'en-US'

      // Get voices
      const voices = speechSynthesis.getVoices()
      console.log('Available voices:', voices.length)
      
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'))
      if (englishVoice) {
        utterance.voice = englishVoice
        console.log('Selected voice:', englishVoice.name)
      }

      utterance.onstart = () => {
        console.log('✅ TTS started successfully')
        setIsPlaying(true)
        setError(null)
      }

      utterance.onend = () => {
        console.log('🏁 TTS finished')
        setIsPlaying(false)
      }

      utterance.onerror = (event) => {
        console.error('❌ TTS error:', event)
        setError('TTS Error: ' + event.error)
        setIsPlaying(false)
      }

      console.log('🚀 Calling speechSynthesis.speak()')
      speechSynthesis.speak(utterance)

    } catch (error) {
      console.error('💥 Exception in testTTS:', error)
      setError('Exception: ' + (error instanceof Error ? error.message : 'Unknown'))
    }
  }

  const checkSpeechSupport = () => {
    console.log('Browser TTS Support Check:')
    console.log('- speechSynthesis available:', 'speechSynthesis' in window)
    console.log('- voices loaded:', speechSynthesis.getVoices().length)
    console.log('- is speaking:', speechSynthesis.speaking)
    console.log('- is pending:', speechSynthesis.pending)
    console.log('- is paused:', speechSynthesis.paused)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Listening Player Debug</h1>
      
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Test Controls */}
      <div className="mb-6 space-y-4">
        <button
          onClick={testTTS}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${
            isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Stop TTS Test' : 'Start TTS Test'}
        </button>

        <button
          onClick={checkSpeechSupport}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Check TTS Support
        </button>
      </div>

      {/* Test Text */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Test Text:</h3>
        <p className="text-sm text-gray-700">{testTranscript}</p>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Debug Steps:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Click &quot;Check TTS Support&quot; and look at console</li>
          <li>2. Click &quot;Start TTS Test&quot; and watch console logs</li>
          <li>3. Report what you see in the console</li>
          <li>4. If it works here but not in /listening/1, we know it&apos;s a component issue</li>
        </ol>
      </div>
    </div>
  )
}
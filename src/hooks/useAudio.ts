import { useState, useCallback } from 'react'

interface UseAudioReturn {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  playWord: (word: string) => Promise<void>
}

export const useAudio = (): UseAudioReturn => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const playWord = useCallback(async (word: string) => {
    if (!word || isPlaying) return

    try {
      setIsLoading(true)
      setError(null)

      // Clean word: remove spaces, special characters, convert to lowercase
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '')

      if (!cleanWord) {
        throw new Error('Invalid word format')
      }

      const audioUrl = `https://www.spellingtraining.com/wrdse/${cleanWord}.mp3`

      // Create audio element
      const audio = new Audio(audioUrl)

      // Set up event listeners
      audio.onloadstart = () => setIsLoading(true)
      audio.oncanplay = () => setIsLoading(false)
      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        setError('Audio not available for this word')
        setIsPlaying(false)
        setIsLoading(false)
      }

      // Try to play
      await audio.play()

    } catch (err) {
      console.error('Audio playback error:', err)
      setError('Failed to play audio')
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [isPlaying])

  return {
    isPlaying,
    isLoading,
    error,
    playWord
  }
}

import { useState, useCallback } from 'react'

interface UseImageReturn {
  imageUrl: string | null
  isLoading: boolean
  error: string | null
  getImageForWord: (englishWord: string) => string
}

export const useImage = (): UseImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getImageForWord = useCallback((englishWord: string): string => {
    if (!englishWord) return ''
    
    // Clean word for search
    const cleanWord = englishWord.toLowerCase()
      .replace(/[^a-z\s]/g, '') // Remove special chars but keep spaces
      .trim()
    
    if (!cleanWord) return ''

    // Use Unsplash Source API - simple and free
    // Format: https://source.unsplash.com/400x300/?{keyword}
    const imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(cleanWord)}`
    
    return imageUrl
  }, [])

  return {
    imageUrl,
    isLoading,
    error,
    getImageForWord
  }
}

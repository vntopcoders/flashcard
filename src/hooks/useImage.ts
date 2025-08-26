import { useState, useCallback } from 'react'

interface UnsplashImage {
  id: string
  urls: {
    small: string
    regular: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
}

interface UseImageReturn {
  imageUrl: string | null
  isLoading: boolean
  error: string | null
  getImageForWord: (englishWord: string) => Promise<string>
  searchImages: (query: string) => Promise<UnsplashImage[]>
}

export const useImage = (): UseImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

  const searchImages = useCallback(async (query: string): Promise<UnsplashImage[]> => {
    if (!query || !UNSPLASH_ACCESS_KEY) return []

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`)
      }

      const data = await response.json()
      return data.results || []
    } catch (err) {
      console.error('Unsplash API error:', err)
      return []
    }
  }, [UNSPLASH_ACCESS_KEY])

  const getImageForWord = useCallback(async (englishWord: string): Promise<string> => {
    if (!englishWord) return ''
    
    // Clean word for search
    const cleanWord = englishWord.toLowerCase()
      .replace(/[^a-z\s]/g, '') // Remove special chars but keep spaces
      .trim()
    
    if (!cleanWord) return ''

    try {
      setIsLoading(true)
      setError(null)

      // Try Unsplash API first
      const images = await searchImages(cleanWord)
      
      if (images.length > 0) {
        const imageUrl = images[0].urls.small
        setImageUrl(imageUrl)
        return imageUrl
      }

      // Fallback to Picsum with consistent seed if Unsplash fails
      const seed = cleanWord.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const fallbackUrl = `https://picsum.photos/400/300?random=${seed}`
      setImageUrl(fallbackUrl)
      return fallbackUrl

    } catch (err) {
      console.error('Image loading error:', err)
      setError('Failed to load image')
      
      // Use Picsum as ultimate fallback
      const seed = cleanWord.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const fallbackUrl = `https://picsum.photos/400/300?random=${seed}`
      setImageUrl(fallbackUrl)
      return fallbackUrl
    } finally {
      setIsLoading(false)
    }
  }, [searchImages])

  return {
    imageUrl,
    isLoading,
    error,
    getImageForWord,
    searchImages
  }
}

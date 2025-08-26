import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Loader2 } from 'lucide-react'
import { useImage } from '@/hooks/useImage'

interface WordImageProps {
  word: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showPlaceholder?: boolean
}

export default function WordImage({ 
  word, 
  alt,
  size = 'md',
  className = '',
  showPlaceholder = true
}: WordImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { getImageForWord } = useImage()

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const imageUrl = getImageForWord(word)

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  if (!word && showPlaceholder) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    )
  }

  if (!word) {
    return null
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Loading spinner */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Error placeholder */}
      {imageError && showPlaceholder && (
        <div className="absolute inset-0 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
          <span className="sr-only">No image available</span>
        </div>
      )}

      {/* Actual image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={alt || `Image for ${word}`}
          width={96}
          height={96}
          className={`
            w-full h-full object-cover rounded-lg border border-gray-200
            transition-opacity duration-300
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
          unoptimized={true}
        />
      )}
    </div>
  )
}

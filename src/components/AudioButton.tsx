import { Volume2, Loader2 } from 'lucide-react'
import { useAudio } from '@/hooks/useAudio'

interface AudioButtonProps {
  word: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function AudioButton({ 
  word, 
  size = 'md', 
  className = ''
}: AudioButtonProps) {
  const { isPlaying, isLoading, error, playWord } = useAudio()

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent click events
    playWord(word)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isLoading || isPlaying || !word}
        className={`
          inline-flex items-center justify-center rounded-full
          bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400
          text-white transition-colors duration-200
          ${buttonSizeClasses[size]} ${className}
        `}
        title={`Play pronunciation: ${word}`}
      >
        {isLoading ? (
          <Loader2 className={`${sizeClasses[size]} animate-spin`} />
        ) : (
          <Volume2 
            className={`${sizeClasses[size]} ${isPlaying ? 'animate-pulse' : ''}`} 
          />
        )}
      </button>
      
      {error && (
        <span className="text-xs text-red-500 max-w-24 truncate" title={error}>
          No audio
        </span>
      )}
    </div>
  )
}

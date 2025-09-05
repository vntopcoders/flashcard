'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings } from 'lucide-react'
import { HybridAudioService } from '@/lib/hybrid-audio-service'

interface ListeningPlayerProps {
  audioUrl?: string
  audioText?: string // For TTS generation
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
  className?: string
  showTranscript?: boolean
  transcript?: string
  questionTimestamps?: Array<{
    questionNumber: number
    start: number
    end?: number
  }>
}

export default function ListeningPlayer({
  audioUrl,
  audioText,
  onTimeUpdate,
  onEnded,
  className = '',
  showTranscript = false,
  transcript = '',
  questionTimestamps = []
}: ListeningPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (audioUrl) {
      initializeAudio()
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioUrl])

  const initializeAudio = () => {
    if (!audioUrl) return

    try {
      setError(null)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })

      audio.addEventListener('timeupdate', () => {
        const time = audio.currentTime
        setCurrentTime(time)
        onTimeUpdate?.(time)
      })

      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        onEnded?.()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      })

      audio.addEventListener('error', (e) => {
        setError('Không thể tải audio. Vui lòng thử lại.')
        setLoading(false)
        setIsPlaying(false)
      })

      // Apply initial settings
      audio.volume = volume
      audio.playbackRate = playbackRate
      audio.muted = isMuted

    } catch (error) {
      setError('Lỗi khởi tạo audio player')
      console.error('Audio initialization error:', error)
    }
  }

  const togglePlayPause = async () => {
    if (!audioUrl && !audioText) {
      setError('Không có audio để phát')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (audioUrl && audioRef.current) {
        // Use direct audio file
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        } else {
          await audioRef.current.play()
          setIsPlaying(true)
          startTimeTracking()
        }
      } else if (audioText) {
        // Use TTS
        if (isPlaying) {
          // Stop TTS playback (if possible)
          setIsPlaying(false)
        } else {
          const result = await HybridAudioService.playAudio({
            word: audioText,
            type: 'sentence',
            volume,
            playbackRate
          })
          
          if (result.success) {
            setIsPlaying(true)
            // TTS doesn't provide progress updates, so simulate
            simulateTTSProgress()
          } else {
            setError(result.error || 'Không thể phát audio')
          }
        }
      }
    } catch (error) {
      setError('Lỗi khi phát audio')
      console.error('Play error:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const time = audioRef.current.currentTime
        setCurrentTime(time)
        onTimeUpdate?.(time)
      }
    }, 100)
  }

  const simulateTTSProgress = () => {
    // Estimate duration for TTS (rough calculation)
    const estimatedDuration = audioText ? audioText.length * 0.05 : 5
    setDuration(estimatedDuration)
    
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      setCurrentTime(elapsed)
      onTimeUpdate?.(elapsed)
      
      if (elapsed >= estimatedDuration) {
        clearInterval(interval)
        setIsPlaying(false)
        onEnded?.()
      }
    }, 100)
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const rewind = () => {
    const newTime = Math.max(0, currentTime - 10)
    seekTo(newTime)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0
  }

  const jumpToQuestion = (timestamp: number) => {
    seekTo(timestamp)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlayPause}
          disabled={loading}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          onClick={rewind}
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors"
          title="Lùi 10 giây"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 relative">
          <div className="bg-gray-200 rounded-full h-2 cursor-pointer"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect()
                 const x = e.clientX - rect.left
                 const percentage = x / rect.width
                 const newTime = percentage * duration
                 seekTo(newTime)
               }}>
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-100"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          {/* Question Markers */}
          {questionTimestamps.map((marker, index) => (
            <button
              key={index}
              onClick={() => jumpToQuestion(marker.start)}
              className="absolute top-0 w-3 h-3 bg-yellow-500 rounded-full transform -translate-y-0.5 hover:bg-yellow-600 transition-colors"
              style={{ left: `${(marker.start / duration) * 100}%` }}
              title={`Câu hỏi ${marker.questionNumber}`}
            />
          ))}
        </div>

        {/* Time Display */}
        <div className="text-sm text-gray-600 font-mono min-w-[80px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="w-8 h-8 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-3 min-w-[150px] z-10">
              <div className="mb-2">
                <label className="text-xs font-medium text-gray-600 block mb-2">Tốc độ phát</label>
                <div className="flex gap-1">
                  {[0.75, 1, 1.25, 1.5].map(rate => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`px-2 py-1 text-xs rounded ${
                        playbackRate === rate 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcript */}
      {showTranscript && transcript && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Transcript:</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
        </div>
      )}

      {/* Question Navigation */}
      {questionTimestamps.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Chuyển đến câu hỏi:</h4>
          <div className="flex flex-wrap gap-2">
            {questionTimestamps.map((marker, index) => (
              <button
                key={index}
                onClick={() => jumpToQuestion(marker.start)}
                className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Q{marker.questionNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
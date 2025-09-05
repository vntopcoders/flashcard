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

  const initializeAudio = async () => {
    setLoading(true)
    setError(null)

    try {
      // If no audioUrl but we have text, generate TTS audio
      if (!audioUrl && audioText) {
        await generateTTSAudio()
        return
      }

      if (!audioUrl) {
        setError('Không có audio để phát. Vui lòng thử tính năng Text-to-Speech.')
        setLoading(false)
        return
      }

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

      setLoading(false)
    } catch (error) {
      setError('Lỗi khởi tạo audio player')
      setLoading(false)
      console.error('Audio initialization error:', error)
    }
  }

  const generateTTSAudio = async () => {
    console.log('🎙️ generateTTSAudio called', { audioText: audioText?.substring(0, 100) + '...' })
    
    if (!audioText) {
      console.log('❌ No audioText provided')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Use Web Speech API for immediate playback
      if ('speechSynthesis' in window) {
        console.log('✅ speechSynthesis is available')
        // Stop any existing speech
        speechSynthesis.cancel()
        
        // Wait for voices to load if not already loaded
        let voices = speechSynthesis.getVoices()
        if (voices.length === 0) {
          await new Promise(resolve => {
            speechSynthesis.onvoiceschanged = () => {
              voices = speechSynthesis.getVoices()
              resolve(voices)
            }
          })
        }

        const utterance = new SpeechSynthesisUtterance(audioText)
        utterance.rate = Math.max(0.1, Math.min(2.0, playbackRate))
        utterance.volume = Math.max(0, Math.min(1, volume))
        utterance.lang = 'en-US'
        utterance.pitch = 1.0
        
        // Try to use the best available English voice
        const preferredVoices = [
          voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en-US')),
          voices.find(voice => voice.name.includes('Microsoft') && voice.lang.startsWith('en-US')),
          voices.find(voice => voice.lang.startsWith('en-US')),
          voices.find(voice => voice.lang.startsWith('en-GB')),
          voices.find(voice => voice.lang.startsWith('en'))
        ].find(voice => voice !== undefined)
        
        if (preferredVoices) {
          utterance.voice = preferredVoices
          console.log('Selected voice:', preferredVoices.name, preferredVoices.lang)
        }

        // Estimate duration (more accurate calculation)
        const wordsPerMinute = 150 // Average English speaking rate
        const words = audioText.split(/\s+/).length
        const estimatedDuration = (words / wordsPerMinute) * 60 / playbackRate

        utterance.onstart = () => {
          setIsPlaying(true)
          setLoading(false)
          setDuration(estimatedDuration)
          setCurrentTime(0)
          
          // Start timer for current time
          intervalRef.current = setInterval(() => {
            setCurrentTime(prev => {
              const newTime = prev + 0.1
              onTimeUpdate?.(newTime)
              return newTime > estimatedDuration ? estimatedDuration : newTime
            })
          }, 100)
        }

        utterance.onend = () => {
          setIsPlaying(false)
          onEnded?.()
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          setCurrentTime(estimatedDuration) // Set to end
        }

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
          setError('Lỗi tạo giọng nói. Vui lòng thử lại.')
          setIsPlaying(false)
          setLoading(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }

        utterance.onpause = () => {
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }

        utterance.onresume = () => {
          setIsPlaying(true)
          // Resume timer
          intervalRef.current = setInterval(() => {
            setCurrentTime(prev => {
              const newTime = prev + 0.1
              onTimeUpdate?.(newTime)
              return newTime > estimatedDuration ? estimatedDuration : newTime
            })
          }, 100)
        }

        // Store utterance reference for control
        audioRef.current = { 
          utterance,
          play: () => {
            speechSynthesis.cancel() // Clear any existing speech
            speechSynthesis.speak(utterance)
          },
          pause: () => speechSynthesis.pause(),
          resume: () => speechSynthesis.resume(),
          stop: () => {
            speechSynthesis.cancel()
            setIsPlaying(false)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
          },
          currentTime: currentTime,
          duration: estimatedDuration
        } as unknown as HTMLAudioElement

        setLoading(false)
      } else {
        setError('Trình duyệt không hỗ trợ Text-to-Speech. Vui lòng sử dụng Chrome, Firefox, Safari hoặc Edge.')
        setLoading(false)
      }
    } catch (error) {
      setError('Lỗi tạo audio từ văn bản: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setLoading(false)
      console.error('TTS generation error:', error)
    }
  }

  const togglePlayPause = async () => {
    console.log('🎵 togglePlayPause called', { audioUrl, audioText: audioText?.substring(0, 50) + '...', isPlaying })
    
    if (!audioUrl && !audioText) {
      setError('Không có audio để phát')
      return
    }

    // Handle TTS playback
    if (!audioUrl && audioText) {
      console.log('🗣️ Using TTS mode', { hasAudioRef: !!audioRef.current, isPlaying })
      
      if (!audioRef.current) {
        console.log('🔄 Generating new TTS audio...')
        await generateTTSAudio()
        return
      }
      
      if (isPlaying) {
        console.log('⏸️ Pausing TTS')
        speechSynthesis.pause()
        setIsPlaying(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      } else {
        console.log('▶️ Resuming/Starting TTS')
        if (speechSynthesis.paused) {
          speechSynthesis.resume()
        } else {
          await generateTTSAudio()
        }
      }
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Handle regular audio file
      if (audioUrl && audioRef.current) {
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
        setLoading(false)
        return
      }

      // Handle TTS - already handled above in the TTS section
      setLoading(false)
    } catch (error) {
      setError('Lỗi khi phát audio: ' + (error instanceof Error ? error.message : 'Unknown error'))
      console.error('Play error:', error)
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

      {/* TTS Info */}
      {!audioUrl && audioText && !error && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <div>
              <div className="font-medium">🎙️ Text-to-Speech Audio</div>
              <div className="text-xs mt-1">
                Sử dụng giọng nói tự động từ trình duyệt. Nhấn ▶️ để nghe audio IELTS.
                {typeof window !== 'undefined' && 'speechSynthesis' in window ? 
                  ' ✅ Trình duyệt hỗ trợ TTS' : 
                  ' ❌ Trình duyệt không hỗ trợ'
                }
              </div>
            </div>
          </div>
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
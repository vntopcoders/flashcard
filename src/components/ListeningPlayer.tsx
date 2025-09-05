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
        // Use setTimeout to avoid setState during render
        setTimeout(() => onTimeUpdate?.(time), 0)
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

  const generateMultiVoiceTTSAudio = async () => {
    console.log('🎙️ generateMultiVoiceTTSAudio called', { audioText: audioText?.substring(0, 100) + '...' })
    
    if (!audioText) {
      console.log('❌ No audioText provided')
      setError('Không có nội dung audio để phát')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Check if speechSynthesis is available
      if (!('speechSynthesis' in window)) {
        setError('Trình duyệt không hỗ trợ Text-to-Speech. Vui lòng sử dụng Chrome, Firefox, Safari hoặc Edge.')
        setLoading(false)
        return
      }

      console.log('✅ speechSynthesis is available')
      
      // Stop any existing speech
      speechSynthesis.cancel()
      
      // Wait a bit for speechSynthesis to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Wait for voices to load if not already loaded
      let voices = speechSynthesis.getVoices()
      if (voices.length === 0) {
        console.log('⏳ Waiting for voices to load...')
        await new Promise(resolve => {
          const timeout = setTimeout(() => {
            console.log('⚠️ Voice loading timeout, proceeding with default')
            resolve(speechSynthesis.getVoices())
          }, 3000)
          
          speechSynthesis.onvoiceschanged = () => {
            clearTimeout(timeout)
            voices = speechSynthesis.getVoices()
            console.log(`📢 Loaded ${voices.length} voices`)
            resolve(voices)
          }
        })
      }

      // Refresh voices
      voices = speechSynthesis.getVoices()
      
      // Select different voices for different speakers
      const maleVoice = voices.find(voice => 
        (voice.name.toLowerCase().includes('male') || 
         voice.name.toLowerCase().includes('david') ||
         voice.name.toLowerCase().includes('mark') ||
         voice.name.toLowerCase().includes('daniel')) && 
        voice.lang.startsWith('en')
      ) || voices.find(voice => voice.lang.startsWith('en-US'))
      
      const femaleVoice = voices.find(voice => 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('susan') ||
         voice.name.toLowerCase().includes('samantha') ||
         voice.name.toLowerCase().includes('karen') ||
         voice.name.toLowerCase().includes('zira')) && 
        voice.lang.startsWith('en')
      ) || voices.find(voice => voice.lang.startsWith('en-GB'))

      console.log('Selected voices:', {
        male: maleVoice?.name,
        female: femaleVoice?.name
      })

      // Parse the transcript to identify speakers and their lines
      const parseTranscriptWithSpeakers = (text: string) => {
        const segments: Array<{text: string, speaker: 'male' | 'female' | 'narrator'}> = []
        
        // First, split by "Part" to handle structured content
        const parts = text.split(/(?=Part \d+:)/).filter(part => part.trim())
        
        for (const part of parts) {
          const partText = part.trim()
          if (!partText) continue
          
          // Extract part title
          const partTitleMatch = partText.match(/^(Part \d+:[^.]*?)(?=\s[A-Z]|\s*$)/)
          if (partTitleMatch) {
            segments.push({ text: partTitleMatch[1], speaker: 'narrator' })
          }
          
          // Remove part title and process the rest
          const contentAfterTitle = partText.replace(/^Part \d+:[^.]*?(?=\s[A-Z]|\s*$)/, '').trim()
          
          // Split by speaker patterns - more comprehensive regex
          const speakerPattern = /\b(Receptionist|Sarah|Student A?|Student B?|Professor|Dr\.|Officer|Advisor|Counselor|Tutor|David Thompson|I'm [A-Z][a-z]+):\s*/gi
          
          const segments_in_part = contentAfterTitle.split(speakerPattern)
          
          let currentSpeaker = 'narrator'
          
          for (let i = 0; i < segments_in_part.length; i++) {
            const segment = segments_in_part[i]?.trim()
            if (!segment) continue
            
            // Check if this segment is a speaker label
            if (segment.match(/^(Receptionist|Sarah|Student A?|Student B?|Professor|Dr\.|Officer|Advisor|Counselor|Tutor|David Thompson|I'm [A-Z][a-z]+)$/i)) {
              // Determine voice based on speaker
              const speakerLower = segment.toLowerCase()
              if (speakerLower.includes('sarah') || 
                  speakerLower.includes('student')) {
                currentSpeaker = 'female'
              } else if (speakerLower.includes('receptionist') || 
                        speakerLower.includes('professor') || 
                        speakerLower.includes('officer') ||
                        speakerLower.includes('advisor') ||
                        speakerLower.includes('counselor') ||
                        speakerLower.includes('tutor') ||
                        speakerLower.includes('david') ||
                        speakerLower.includes('dr.')) {
                currentSpeaker = 'male'
              } else {
                currentSpeaker = 'narrator'
              }
              continue
            }
            
            // This is actual content to speak
            if (segment.length > 0) {
              // Split long segments by sentences for better pacing
              const sentences = segment.split(/(?<=[.!?])\s+/)
              
              for (const sentence of sentences) {
                if (sentence.trim().length > 0) {
                  segments.push({ 
                    text: sentence.trim(), 
                    speaker: currentSpeaker as 'male' | 'female' | 'narrator'
                  })
                }
              }
            }
          }
          
          // Handle any remaining text that doesn't have speaker labels
          if (!contentAfterTitle.match(speakerPattern)) {
            // This is narrative text
            const sentences = contentAfterTitle.split(/(?<=[.!?])\s+/)
            for (const sentence of sentences) {
              if (sentence.trim().length > 0) {
                segments.push({ text: sentence.trim(), speaker: 'narrator' })
              }
            }
          }
        }
        
        return segments.filter(seg => seg.text.length > 0)
      }

      const segments = parseTranscriptWithSpeakers(audioText)
      console.log(`📝 Parsed ${segments.length} segments:`, segments.slice(0, 3))

      // Estimate total duration
      const totalWords = segments.reduce((sum, seg) => sum + seg.text.split(/\s+/).length, 0)
      const wordsPerMinute = 150
      const estimatedDuration = (totalWords / wordsPerMinute) * 60 / playbackRate
      
      console.log(`📊 Estimated duration: ${estimatedDuration}s for ${totalWords} words`)

      // Set initial state
      setDuration(estimatedDuration)
      setCurrentTime(0)
      setIsPlaying(true)
      setLoading(false)

      // Start timer for progress tracking
      const startTime = Date.now()
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        setCurrentTime(elapsed)
        setTimeout(() => onTimeUpdate?.(elapsed), 0)
        
        if (elapsed >= estimatedDuration) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          setIsPlaying(false)
          setTimeout(() => onEnded?.(), 0)
        }
      }, 100)

      // Function to play segments sequentially with different voices
      const playSegments = (index: number) => {
        if (index >= segments.length) {
          console.log('🏁 All segments completed')
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setTimeout(() => onEnded?.(), 0)
          return
        }

        const segment = segments[index]
        const utterance = new SpeechSynthesisUtterance(segment.text)
        
        // Configure utterance
        utterance.rate = Math.max(0.5, Math.min(2.0, playbackRate))
        utterance.volume = Math.max(0, Math.min(1, isMuted ? 0 : volume))
        utterance.lang = 'en-US'
        
        // Select voice based on speaker
        if (segment.speaker === 'female' && femaleVoice) {
          utterance.voice = femaleVoice
          utterance.pitch = 1.1 // Slightly higher pitch for female
        } else if (segment.speaker === 'male' && maleVoice) {
          utterance.voice = maleVoice
          utterance.pitch = 0.9 // Slightly lower pitch for male
        } else {
          // Narrator or default
          utterance.voice = maleVoice || voices.find(v => v.lang.startsWith('en')) || null
          utterance.pitch = 1.0
        }

        console.log(`🎭 Playing segment ${index + 1}/${segments.length} (${segment.speaker}): "${segment.text.substring(0, 50)}..."`)

        utterance.onend = () => {
          // Add a small pause between speakers
          setTimeout(() => {
            playSegments(index + 1)
          }, 300) // 300ms pause between segments
        }

        utterance.onerror = (event) => {
          console.error(`❌ Error in segment ${index}:`, event)
          // Continue with next segment on error
          setTimeout(() => playSegments(index + 1), 100)
        }

        speechSynthesis.speak(utterance)
      }

      // Store control functions
      audioRef.current = {
        currentSegmentIndex: 0,
        segments,
        isMultiVoice: true,
        play: () => {
          console.log('🎮 Multi-voice TTS play() called')
          speechSynthesis.cancel()
          playSegments(0)
        },
        pause: () => {
          console.log('🎮 Multi-voice TTS pause() called')
          speechSynthesis.pause()
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        },
        resume: () => {
          console.log('🎮 Multi-voice TTS resume() called')
          speechSynthesis.resume()
          setIsPlaying(true)
        },
        stop: () => {
          console.log('🎮 Multi-voice TTS stop() called')
          speechSynthesis.cancel()
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        },
        currentTime: 0,
        duration: estimatedDuration,
        paused: false,
        ended: false
      } as unknown as HTMLAudioElement

      // Start playing the first segment
      playSegments(0)

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Multi-voice TTS generation error:', error)
      setError('Lỗi tạo audio đa giọng nói: ' + errorMsg)
      setLoading(false)
    }
  }

  // Keep the original single-voice function as fallback
  const generateTTSAudio = generateMultiVoiceTTSAudio

  const togglePlayPause = async () => {
    console.log('🎵 togglePlayPause called', { 
      audioUrl, 
      hasAudioText: !!audioText, 
      isPlaying, 
      hasAudioRef: !!audioRef.current,
      speechSynthesisState: speechSynthesis.paused ? 'paused' : speechSynthesis.speaking ? 'speaking' : 'idle'
    })
    
    if (!audioUrl && !audioText) {
      setError('Không có audio hoặc văn bản để phát')
      return
    }

    setError(null) // Clear any existing errors

    // Handle TTS playback
    if (!audioUrl && audioText) {
      console.log('🗣️ Using TTS mode')
      
      try {
        if (isPlaying) {
          console.log('⏸️ Pausing TTS')
          speechSynthesis.pause()
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        } else {
          // Check if we have a paused speech
          if (speechSynthesis.paused && speechSynthesis.speaking) {
            console.log('▶️ Resuming paused TTS')
            speechSynthesis.resume()
            setIsPlaying(true)
            // Resume timer
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            intervalRef.current = setInterval(() => {
              setCurrentTime(prev => {
                const newTime = prev + 0.1
                onTimeUpdate?.(newTime)
                return newTime > duration ? duration : newTime
              })
            }, 100)
          } else {
            console.log('▶️ Starting new TTS')
            await generateTTSAudio()
          }
        }
      } catch (error) {
        console.error('❌ TTS playback error:', error)
        setError('Lỗi phát audio TTS: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
      return
    }

    // Handle regular audio file
    if (audioUrl) {
      setLoading(true)
      
      try {
        if (!audioRef.current) {
          await initializeAudio()
          return
        }

        if (isPlaying) {
          console.log('⏸️ Pausing regular audio')
          audioRef.current.pause()
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        } else {
          console.log('▶️ Playing regular audio')
          await audioRef.current.play()
          setIsPlaying(true)
          startTimeTracking()
        }
      } catch (error) {
        console.error('❌ Regular audio playback error:', error)
        setError('Lỗi phát audio: ' + (error instanceof Error ? error.message : 'Unknown error'))
      } finally {
        setLoading(false)
      }
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
        // Use setTimeout to avoid setState during render
        setTimeout(() => onTimeUpdate?.(time), 0)
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <div>
                <div className="font-medium">🎙️ Multi-Voice TTS Audio</div>
                <div className="text-xs mt-1">
                  🎭 Multi-voice: Nữ (Sarah/Students) - Nam (Receptionist/Professor/Staff) - Narrator
                  {typeof window !== 'undefined' && 'speechSynthesis' in window ? 
                    ' ✅ Trình duyệt hỗ trợ TTS' : 
                    ' ❌ Trình duyệt không hỗ trợ'
                  }
                </div>
              </div>
            </div>
            
            {/* Test TTS Button */}
            <button
              onClick={async () => {
                speechSynthesis.cancel()
                const testUtterance = new SpeechSynthesisUtterance('Hello, this is a test of the text to speech system.')
                testUtterance.lang = 'en-US'
                testUtterance.rate = 1
                testUtterance.volume = 1
                speechSynthesis.speak(testUtterance)
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Test TTS
            </button>
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
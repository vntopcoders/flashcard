/**
 * Hybrid Audio Service
 * Priority: Static Audio Files → Google TTS → Cached Audio
 * Provides seamless pronunciation with optimal performance and cost
 */

import { GoogleTTSService } from './google-tts'
import { OfflineAudioCache } from './offline-audio-cache'

export interface AudioSource {
  type: 'static' | 'tts' | 'cached'
  url?: string
  base64?: string
  cached?: boolean
}

export interface HybridAudioOptions {
  word: string
  accent?: 'US' | 'UK' | 'AU'
  type?: 'word' | 'sentence'
  forceRegenerate?: boolean
  volume?: number
  playbackRate?: number
}

export interface HybridAudioResponse {
  success: boolean
  audioSource: AudioSource
  error?: string
  loadTime?: number
}

export class HybridAudioService {
  // Static audio sources - you can add more sources here
  private static readonly STATIC_AUDIO_SOURCES = [
    {
      name: 'spellingtraining',
      baseUrl: 'https://www.spellingtraining.com/wrdse/',
      format: 'mp3',
      // Only supports English words, no accent variation
      supports: (word: string, accent: string) => {
        return accent === 'US' && /^[a-zA-Z]+$/.test(word) && word.length <= 15
      }
    },
    // Add more static sources here
    // {
    //   name: 'cambridge',
    //   baseUrl: 'https://dictionary.cambridge.org/media/english/us_pron/',
    //   format: 'mp3',
    //   supports: (word: string, accent: string) => true
    // }
  ]

  /**
   * Main method to get and play audio with hybrid approach
   */
  static async playAudio(options: HybridAudioOptions): Promise<HybridAudioResponse> {
    const startTime = Date.now()
    const { word, accent = 'US', type = 'word', forceRegenerate = false, volume, playbackRate } = options

    try {
      // Step 1: Check offline cache first (unless forcing regeneration)
      if (!forceRegenerate && OfflineAudioCache.isSupported()) {
        const cachedAudio = await OfflineAudioCache.getCachedAudio(word, accent)
        if (cachedAudio) {
          await this.playBase64Audio(cachedAudio, { volume, playbackRate })
          return {
            success: true,
            audioSource: { type: 'cached', base64: cachedAudio, cached: true },
            loadTime: Date.now() - startTime
          }
        }
      }

      // Step 2: Try static audio sources
      if (type === 'word') {
        const staticResult = await this.tryStaticAudio(word, accent)
        if (staticResult.success && staticResult.audioSource.url) {
          await this.playStaticAudio(staticResult.audioSource.url, { volume, playbackRate })
          
          // Cache the static audio for offline use
          if (OfflineAudioCache.isSupported()) {
            try {
              const audioData = await this.convertUrlToBase64(staticResult.audioSource.url)
              await OfflineAudioCache.cacheAudio(word, accent, audioData)
            } catch (error) {
              console.warn('Failed to cache static audio:', error)
            }
          }
          
          return {
            success: true,
            audioSource: staticResult.audioSource,
            loadTime: Date.now() - startTime
          }
        }
      }

      // Step 3: Fallback to Google TTS
      const ttsResult = await this.tryGoogleTTS(word, accent, type)
      if (ttsResult.success && ttsResult.audioSource.base64) {
        await this.playBase64Audio(ttsResult.audioSource.base64, { volume, playbackRate })
        return {
          success: true,
          audioSource: ttsResult.audioSource,
          loadTime: Date.now() - startTime
        }
      }

      // Step 4: All methods failed
      return {
        success: false,
        audioSource: { type: 'static' },
        error: 'All audio sources failed',
        loadTime: Date.now() - startTime
      }

    } catch (error) {
      console.error('Hybrid audio service error:', error)
      return {
        success: false,
        audioSource: { type: 'static' },
        error: error instanceof Error ? error.message : 'Unknown error',
        loadTime: Date.now() - startTime
      }
    }
  }

  /**
   * Try to get audio from static sources
   */
  private static async tryStaticAudio(word: string, accent: string): Promise<HybridAudioResponse> {
    for (const source of this.STATIC_AUDIO_SOURCES) {
      if (!source.supports(word, accent)) {
        continue
      }

      const url = `${source.baseUrl}${word.toLowerCase()}.${source.format}`
      
      try {
        // Check if the static audio file exists
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
          return {
            success: true,
            audioSource: { type: 'static', url }
          }
        }
      } catch {
        console.debug(`Static audio not found at ${source.name}:`, url)
        continue
      }
    }

    return {
      success: false,
      audioSource: { type: 'static' },
      error: 'No static audio sources available'
    }
  }

  /**
   * Try to get audio from Google TTS
   */
  private static async tryGoogleTTS(word: string, accent: string, type: 'word' | 'sentence'): Promise<HybridAudioResponse> {
    try {
      const ttsResponse = type === 'word' 
        ? await GoogleTTSService.pronounceWord(word, accent as 'US' | 'UK' | 'AU')
        : await GoogleTTSService.pronounceSentence(word, accent as 'US' | 'UK' | 'AU')

      if (ttsResponse.error) {
        return {
          success: false,
          audioSource: { type: 'tts' },
          error: ttsResponse.error
        }
      }

      return {
        success: true,
        audioSource: { 
          type: 'tts', 
          base64: ttsResponse.audioContent,
          cached: ttsResponse.cached || false
        }
      }
    } catch (error) {
      return {
        success: false,
        audioSource: { type: 'tts' },
        error: error instanceof Error ? error.message : 'TTS failed'
      }
    }
  }

  /**
   * Play static audio from URL
   */
  private static async playStaticAudio(url: string, options?: { volume?: number, playbackRate?: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(url)
        
        // Apply settings
        if (options?.volume !== undefined) {
          audio.volume = Math.max(0, Math.min(1, options.volume))
        }
        
        if (options?.playbackRate !== undefined) {
          audio.playbackRate = Math.max(0.25, Math.min(4, options.playbackRate))
        }
        
        audio.onended = () => resolve()
        audio.onerror = () => reject(new Error('Static audio playback failed'))
        
        audio.play()
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Play base64 audio (TTS or cached)
   */
  private static async playBase64Audio(base64Audio: string, options?: { volume?: number, playbackRate?: number }): Promise<void> {
    return GoogleTTSService.playAudio(base64Audio, {
      volume: options?.volume,
      playbackRate: options?.playbackRate
    })
  }

  /**
   * Convert static audio URL to base64 for caching
   */
  private static async convertUrlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Convert to base64
      let binary = ''
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i])
      }
      
      return btoa(binary)
    } catch (error) {
      console.error('Failed to convert URL to base64:', error)
      throw error
    }
  }

  /**
   * Pre-cache audio for a list of words using hybrid approach
   */
  static async preCacheWords(
    words: string[],
    accent: string = 'US',
    onProgress?: (completed: number, total: number, currentWord?: string) => void
  ): Promise<{ cached: number, failed: string[] }> {
    let cached = 0
    const failed: string[] = []

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      onProgress?.(i, words.length, word)

      try {
        // Check if already cached
        if (await OfflineAudioCache.isCached(word, accent)) {
          onProgress?.(i + 1, words.length, word)
          continue
        }

        // Try to get audio (this will cache it automatically)
        const result = await this.playAudio({
          word,
          accent: accent as 'US' | 'UK' | 'AU',
          volume: 0 // Silent pre-caching
        })

        if (result.success) {
          cached++
        } else {
          failed.push(word)
        }
      } catch (error) {
        console.error(`Failed to pre-cache "${word}":`, error)
        failed.push(word)
      }

      onProgress?.(i + 1, words.length, word)
      
      // Small delay to avoid rate limiting
      if (i < words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return { cached, failed }
  }

  /**
   * Get audio source information without playing
   */
  static async getAudioSource(word: string, accent: string = 'US'): Promise<AudioSource> {
    // Check cache first
    if (OfflineAudioCache.isSupported()) {
      const cachedAudio = await OfflineAudioCache.getCachedAudio(word, accent)
      if (cachedAudio) {
        return { type: 'cached', base64: cachedAudio, cached: true }
      }
    }

    // Check static audio
    const staticResult = await this.tryStaticAudio(word, accent)
    if (staticResult.success) {
      return staticResult.audioSource
    }

    // Default to TTS
    return { type: 'tts' }
  }

  /**
   * Clear all cached audio
   */
  static async clearCache(): Promise<boolean> {
    return OfflineAudioCache.clearCache()
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats() {
    return OfflineAudioCache.getCacheStats()
  }
}
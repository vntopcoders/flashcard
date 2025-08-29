/**
 * Google Cloud Text-to-Speech Service
 * Provides pronunciation audio for vocabulary words with offline caching
 */

import { OfflineAudioCache } from './offline-audio-cache'

export interface TTSOptions {
  text: string
  languageCode?: string
  voiceName?: string
  audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS'
  speakingRate?: number
  pitch?: number
}

export interface TTSResponse {
  audioContent: string // Base64 encoded audio
  error?: string
  cached?: boolean // Indicates if audio came from offline cache
}

export class GoogleTTSService {
  private static readonly API_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize'
  
  // Default voice configurations for IELTS learning
  private static readonly VOICE_CONFIGS = {
    'en-US': {
      name: 'en-US-Neural2-J', // Female voice, clear pronunciation
      gender: 'FEMALE'
    },
    'en-GB': {
      name: 'en-GB-Neural2-B', // Male British accent
      gender: 'MALE'
    },
    'en-AU': {
      name: 'en-AU-Neural2-A', // Australian accent option
      gender: 'FEMALE'
    }
  }

  /**
   * Generate audio for text using Google Cloud TTS with offline caching
   */
  static async generateAudio(options: TTSOptions): Promise<TTSResponse> {
    try {
      const {
        text,
        languageCode = 'en-US',
        audioEncoding = 'MP3',
        speakingRate = 0.9, // Slightly slower for learning
        pitch = 0.0
      } = options

      const accent = languageCode.includes('GB') ? 'UK' : languageCode.includes('AU') ? 'AU' : 'US'

      // Check offline cache first
      if (OfflineAudioCache.isSupported()) {
        const cachedAudio = await OfflineAudioCache.getCachedAudio(text, accent)
        if (cachedAudio) {
          return {
            audioContent: cachedAudio,
            cached: true
          }
        }
      }

      const voiceConfig = this.VOICE_CONFIGS[languageCode as keyof typeof this.VOICE_CONFIGS] 
        || this.VOICE_CONFIGS['en-US']

      const requestBody = {
        input: { text },
        voice: {
          languageCode,
          name: voiceConfig.name,
          ssmlGender: voiceConfig.gender
        },
        audioConfig: {
          audioEncoding,
          speakingRate,
          pitch,
          volumeGainDb: 0.0,
          sampleRateHertz: audioEncoding === 'MP3' ? 24000 : 22050
        }
      }

      const response = await fetch('/api/google-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Cache the audio data for offline use
      if (data.audioContent && OfflineAudioCache.isSupported()) {
        await OfflineAudioCache.cacheAudio(text, accent, data.audioContent)
      }

      return data
      
    } catch (error) {
      console.error('Google TTS Error:', error)
      return {
        audioContent: '',
        error: error instanceof Error ? error.message : 'TTS generation failed'
      }
    }
  }

  /**
   * Generate pronunciation for vocabulary word
   */
  static async pronounceWord(
    word: string, 
    accent: 'US' | 'UK' | 'AU' = 'US'
  ): Promise<TTSResponse> {
    const languageMap = {
      'US': 'en-US',
      'UK': 'en-GB', 
      'AU': 'en-AU'
    }

    return this.generateAudio({
      text: word,
      languageCode: languageMap[accent],
      speakingRate: 0.8, // Slower for pronunciation practice
      pitch: 0.2 // Slightly higher pitch for clarity
    })
  }

  /**
   * Generate audio for definition or example sentence
   */
  static async pronounceSentence(
    sentence: string,
    accent: 'US' | 'UK' | 'AU' = 'US'
  ): Promise<TTSResponse> {
    const languageMap = {
      'US': 'en-US',
      'UK': 'en-GB',
      'AU': 'en-AU'
    }

    return this.generateAudio({
      text: sentence,
      languageCode: languageMap[accent],
      speakingRate: 1.0, // Normal speed for sentences
      pitch: 0.0
    })
  }

  /**
   * Create audio URL from base64 content
   */
  static createAudioUrl(base64Audio: string, mimeType: string = 'audio/mp3'): string {
    const binaryString = atob(base64Audio)
    const bytes = new Uint8Array(binaryString.length)
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    const blob = new Blob([bytes], { type: mimeType })
    return URL.createObjectURL(blob)
  }

  /**
   * Play audio from base64 content with settings
   */
  static async playAudio(base64Audio: string, options?: {
    volume?: number
    playbackRate?: number
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audioUrl = this.createAudioUrl(base64Audio)
        const audio = new Audio(audioUrl)
        
        // Apply audio settings
        if (options?.volume !== undefined) {
          audio.volume = Math.max(0, Math.min(1, options.volume))
        }
        
        if (options?.playbackRate !== undefined) {
          audio.playbackRate = Math.max(0.25, Math.min(4, options.playbackRate))
        }
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl) // Clean up
          resolve()
        }
        
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl)
          reject(new Error('Audio playback failed'))
        }
        
        audio.play()
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Batch generate audio for multiple words
   */
  static async batchPronounce(
    words: string[],
    accent: 'US' | 'UK' | 'AU' = 'US',
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>()
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const response = await this.pronounceWord(word, accent)
      
      if (response.audioContent && !response.error) {
        results.set(word, response.audioContent)
      }
      
      onProgress?.(i + 1, words.length)
      
      // Small delay to avoid rate limiting
      if (i < words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return results
  }
}
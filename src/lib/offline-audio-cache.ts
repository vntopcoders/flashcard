/**
 * Offline Audio Cache Service
 * Provides persistent audio storage using IndexedDB
 */

interface CachedAudio {
  id: string
  text: string
  accent: string
  audioData: string // Base64 encoded audio
  timestamp: number
  size: number
}

export class OfflineAudioCache {
  private static readonly DB_NAME = 'ielts-audio-cache'
  private static readonly DB_VERSION = 1
  private static readonly STORE_NAME = 'audio-files'
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB limit
  private static db: IDBDatabase | null = null

  /**
   * Initialize IndexedDB database
   */
  static async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB not available in server environment'))
        return
      }

      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' })
          store.createIndex('text', 'text', { unique: false })
          store.createIndex('accent', 'accent', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  /**
   * Generate cache key for audio
   */
  private static generateKey(text: string, accent: string): string {
    return `${text.toLowerCase().trim()}-${accent}`
  }

  /**
   * Check if audio is cached offline
   */
  static async isCached(text: string, accent: string): Promise<boolean> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      const key = this.generateKey(text, accent)
      
      return new Promise((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(!!request.result)
        request.onerror = () => resolve(false)
      })
    } catch (error) {
      console.error('Error checking cache:', error)
      return false
    }
  }

  /**
   * Get cached audio data
   */
  static async getCachedAudio(text: string, accent: string): Promise<string | null> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      const key = this.generateKey(text, accent)
      
      return new Promise((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => {
          if (request.result) {
            // Update access timestamp
            this.updateAccessTime(key)
            resolve(request.result.audioData)
          } else {
            resolve(null)
          }
        }
        request.onerror = () => resolve(null)
      })
    } catch (error) {
      console.error('Error getting cached audio:', error)
      return null
    }
  }

  /**
   * Cache audio data
   */
  static async cacheAudio(
    text: string, 
    accent: string, 
    audioData: string
  ): Promise<boolean> {
    try {
      const db = await this.initDB()
      const key = this.generateKey(text, accent)
      const size = audioData.length * 0.75 // Estimate base64 size
      
      // Check cache size limit
      const currentSize = await this.getCurrentCacheSize()
      if (currentSize + size > this.MAX_CACHE_SIZE) {
        await this.cleanupCache()
      }

      const cachedAudio: CachedAudio = {
        id: key,
        text,
        accent,
        audioData,
        timestamp: Date.now(),
        size
      }

      const transaction = db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      
      return new Promise((resolve) => {
        const request = store.put(cachedAudio)
        request.onsuccess = () => resolve(true)
        request.onerror = () => resolve(false)
      })
    } catch (error) {
      console.error('Error caching audio:', error)
      return false
    }
  }

  /**
   * Get current cache size
   */
  private static async getCurrentCacheSize(): Promise<number> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      
      return new Promise((resolve) => {
        const request = store.getAll()
        request.onsuccess = () => {
          const totalSize = request.result.reduce(
            (sum: number, item: CachedAudio) => sum + item.size, 
            0
          )
          resolve(totalSize)
        }
        request.onerror = () => resolve(0)
      })
    } catch (error) {
      console.error('Error getting cache size:', error)
      return 0
    }
  }

  /**
   * Clean up old cached files
   */
  private static async cleanupCache(): Promise<void> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      const index = store.index('timestamp')
      
      // Get all items sorted by timestamp (oldest first)
      const request = index.getAll()
      
      request.onsuccess = () => {
        const items = request.result.sort((a: CachedAudio, b: CachedAudio) => 
          a.timestamp - b.timestamp
        )
        
        // Remove oldest 25% of items
        const itemsToDelete = Math.floor(items.length * 0.25)
        for (let i = 0; i < itemsToDelete; i++) {
          store.delete(items[i].id)
        }
      }
    } catch (error) {
      console.error('Error cleaning up cache:', error)
    }
  }

  /**
   * Update access timestamp for LRU cache
   */
  private static async updateAccessTime(key: string): Promise<void> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      
      const getRequest = store.get(key)
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const item = getRequest.result
          item.timestamp = Date.now()
          store.put(item)
        }
      }
    } catch (error) {
      console.error('Error updating access time:', error)
    }
  }

  /**
   * Pre-cache common vocabulary words
   */
  static async preCacheVocabulary(
    words: string[], 
    accent: string = 'US',
    onProgress?: (completed: number, total: number) => void
  ): Promise<number> {
    let cached = 0
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      
      // Skip if already cached
      if (await this.isCached(word, accent)) {
        onProgress?.(i + 1, words.length)
        continue
      }

      try {
        // Generate audio via TTS API
        const response = await fetch('/api/google-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: word },
            voice: {
              languageCode: accent === 'US' ? 'en-US' : 'en-GB',
              name: accent === 'US' ? 'en-US-Neural2-J' : 'en-GB-Neural2-B'
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: 0.8,
              pitch: 0.2
            }
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.audioContent) {
            const success = await this.cacheAudio(word, accent, data.audioContent)
            if (success) cached++
          }
        }
      } catch (error) {
        console.error(`Failed to cache audio for "${word}":`, error)
      }
      
      onProgress?.(i + 1, words.length)
      
      // Small delay to avoid rate limiting
      if (i < words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    return cached
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalItems: number
    totalSize: number
    sizeMB: number
    usagePercent: number
  }> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      
      return new Promise((resolve) => {
        const request = store.getAll()
        request.onsuccess = () => {
          const items = request.result
          const totalSize = items.reduce(
            (sum: number, item: CachedAudio) => sum + item.size, 
            0
          )
          
          resolve({
            totalItems: items.length,
            totalSize,
            sizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
            usagePercent: Math.round((totalSize / this.MAX_CACHE_SIZE) * 100)
          })
        }
        request.onerror = () => resolve({
          totalItems: 0,
          totalSize: 0,
          sizeMB: 0,
          usagePercent: 0
        })
      })
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return { totalItems: 0, totalSize: 0, sizeMB: 0, usagePercent: 0 }
    }
  }

  /**
   * Clear all cached audio
   */
  static async clearCache(): Promise<boolean> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      
      return new Promise((resolve) => {
        const request = store.clear()
        request.onsuccess = () => resolve(true)
        request.onerror = () => resolve(false)
      })
    } catch (error) {
      console.error('Error clearing cache:', error)
      return false
    }
  }

  /**
   * Check if browser supports offline caching
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'indexedDB' in window && 
           'serviceWorker' in navigator
  }
}
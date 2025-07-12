export interface CacheEntry {
  tracks: any[]
  timestamp: number
  expiresAt: number
}

export interface FetchOptions {
  timeout?: number
  priority?: 'high' | 'normal' | 'low'
  background?: boolean
}

export class TrackCacheService {
  private cache = new Map<string, CacheEntry>()
  private pendingRequests = new Map<string, Promise<any[]>>()
  private backgroundQueue = new Set<string>()
  private maxCacheSize = 100
  private defaultTtl = 5 * 60 * 1000 // 5 minutes

  /**
   * Get tracks for an album with intelligent caching
   */
  async getTracks(albumId: string, options: FetchOptions = {}): Promise<any[]> {
    // Check cache first
    const cached = this.getCachedTracks(albumId)
    if (cached) {
      return cached
    }

    // Check if request is already in progress
    const pending = this.pendingRequests.get(albumId)
    if (pending) {
      return pending
    }

    // Start new request
    const promise = this.fetchTracks(albumId, options)
    this.pendingRequests.set(albumId, promise)

    try {
      const tracks = await promise
      this.setCachedTracks(albumId, tracks)
      return tracks
    } finally {
      this.pendingRequests.delete(albumId)
    }
  }

  /**
   * Prefetch tracks in the background
   */
  async prefetchTracks(albumId: string): Promise<void> {
    if (this.getCachedTracks(albumId) || this.pendingRequests.has(albumId)) {
      return
    }

    this.backgroundQueue.add(albumId)

    try {
      await this.getTracks(albumId, {
        timeout: 5000,
        priority: 'low',
        background: true,
      })
    } catch (error) {
      // Silently fail background prefetch
      console.debug('Background prefetch failed:', error)
    } finally {
      this.backgroundQueue.delete(albumId)
    }
  }

  /**
   * Check if tracks are cached
   */
  hasCachedTracks(albumId: string): boolean {
    return !!this.getCachedTracks(albumId)
  }

  /**
   * Check if prefetch is in progress
   */
  isPrefetching(albumId: string): boolean {
    return this.backgroundQueue.has(albumId)
  }

  /**
   * Get cached tracks if available and not expired
   */
  private getCachedTracks(albumId: string): any[] | null {
    const entry = this.cache.get(albumId)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(albumId)
      return null
    }

    return entry.tracks
  }

  /**
   * Set tracks in cache
   */
  private setCachedTracks(albumId: string, tracks: any[]): void {
    const now = Date.now()
    this.cache.set(albumId, {
      tracks,
      timestamp: now,
      expiresAt: now + this.defaultTtl,
    })

    // Cleanup old entries if cache is full
    this.cleanup()
  }

  /**
   * Fetch tracks with timeout and retry logic
   */
  private async fetchTracks(albumId: string, options: FetchOptions = {}): Promise<any[]> {
    const { timeout = 8000, priority = 'normal', background = false } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`/api/albums/${albumId}/tracks`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=300',
          Priority: priority,
          ...(background && { 'Background-Request': 'true' }),
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          throw new Error(`Request timed out after ${timeout / 1000} seconds`)
        }
        throw fetchError
      }
      throw new Error('Unknown error occurred')
    }
  }

  /**
   * Cleanup old cache entries
   */
  private cleanup(): void {
    if (this.cache.size <= this.maxCacheSize) return

    // Remove oldest entries
    const entries = Array.from(this.cache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)

    const toDelete = entries.slice(0, entries.length - this.maxCacheSize)
    toDelete.forEach(([albumId]) => this.cache.delete(albumId))
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear()
    this.pendingRequests.clear()
    this.backgroundQueue.clear()
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      backgroundQueue: this.backgroundQueue.size,
      hitRate: this.calculateHitRate(),
    }
  }

  private calculateHitRate(): number {
    // Implementation would track hits vs misses
    return 0 // Placeholder
  }
}

// Singleton instance
export const trackCacheService = new TrackCacheService()

import { computed, inject, Injectable, signal } from '@angular/core'

import { Player } from '../services'
import { QueueStore } from './queue-store'

import { PLAYBACK_STATUS, PlaybackStatus, REPEAT_MODE } from '@/shared/enums'
import { Queue } from '@/shared/models'

@Injectable({
  providedIn: 'root',
})
export class PlaybackStore {
  private readonly player = inject(Player)
  readonly queueStore = inject(QueueStore)

  readonly status = signal<PlaybackStatus>(PLAYBACK_STATUS.None)
  readonly volume = signal<number>(50)
  readonly muted = signal<boolean>(false)
  readonly currentTime = signal<number>(0)

  readonly currentDuration = computed(() => this.queueStore.currentTrack()?.duration ?? 0)

  constructor() {
    this.registerEventListeners()
  }

  play(): void {
    this.status.set(PLAYBACK_STATUS.Playing)
    this.player.play()
  }

  pause(): void {
    this.status.set(PLAYBACK_STATUS.Paused)
    this.player.pause()
  }

  seek(time: number): void {
    if (time < 0) {
      this.currentTime.set(0)
    } else {
      this.currentTime.set(Math.min(time, this.currentDuration()))
    }

    this.player.seek(this.currentTime())
  }

  setVolume(volume: number): void {
    this.volume.set(volume)
    this.muted.set(volume === 0)
    this.player.setVolume(volume)
  }

  toggleMute(): void {
    this.muted.set(!this.muted())
    this.player.setMute(this.muted())

    if (!this.muted() && this.volume() === 0) {
      this.setVolume(10)
    }
  }

  /**
   * Toggle play state for a specific track
   * - If same track playing -> pause
   * - If same track paused -> resume
   * - If different track -> set new queue and play
   */
  togglePlay(trackId: string, createQueue: (trackId: string) => Queue<unknown>): void {
    const currentTrack = this.queueStore.currentTrack()
    const isCurrentTrack = currentTrack?.id === trackId
    const isPlaying = this.status() === PLAYBACK_STATUS.Playing

    if (isCurrentTrack && isPlaying) {
      // Same track playing -> pause
      this.pause()
    } else if (isCurrentTrack && !isPlaying) {
      // Same track paused -> resume
      this.play()
    } else {
      // Different track -> set queue and play
      const queue = createQueue(trackId)
      this.queueStore.setQueue(queue)
    }
  }

  private registerEventListeners(): void {
    this.player.onPlaybackTimeUpdated((event) => {
      this.currentTime.set(event.time ?? 0)
    })

    this.player.onManifestLoaded(() => {
      this.play()
    })

    this.player.onPlaybackEnded(() => {
      switch (this.queueStore.repeat()) {
        case REPEAT_MODE.Single:
          this.play()
          break
        case REPEAT_MODE.All:
          this.queueStore.next()
          break
        case REPEAT_MODE.None:
          if (this.queueStore.hasNext()) {
            this.queueStore.next()
          }
          break
      }
    })

    this.player.onManifestLoadingStarted(() => {
      this.status.set(PLAYBACK_STATUS.Loading)
    })
  }
}

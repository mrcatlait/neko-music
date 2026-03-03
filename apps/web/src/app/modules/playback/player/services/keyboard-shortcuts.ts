import { DOCUMENT, inject, Injectable, OnDestroy } from '@angular/core'

import { PlaybackStore } from '@/core/stores'
import { PLAYBACK_STATUS } from '@/shared/enums'

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcuts implements OnDestroy {
  private readonly document = inject(DOCUMENT)
  private readonly playbackStore = inject(PlaybackStore)

  constructor() {
    this.registerEventListeners()
  }

  ngOnDestroy(): void {
    this.removeEventListeners()
  }

  registerEventListeners(): void {
    this.document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  removeEventListeners(): void {
    this.document.removeEventListener('keydown', this.handleKeyDown.bind(this))
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (event.key) {
      // Basic playback controls
      case ' ':
        event.preventDefault()
        this.togglePlay()
        break
      case 'MediaPlayPause':
      case 'PlayPause':
        event.preventDefault()
        this.togglePlay()
        break
      case 'MediaPlay':
        event.preventDefault()
        this.playbackStore.play()
        break
      case 'MediaPause':
        event.preventDefault()
        this.playbackStore.pause()
        break
      case 'MediaStop':
        event.preventDefault()
        this.playbackStore.pause()
        this.playbackStore.seek(0)
        break

      // Track navigation
      case 'MediaTrackNext':
      case 'MediaNextTrack':
        event.preventDefault()
        this.playbackStore.queueStore.next()
        break
      case 'MediaTrackPrevious':
      case 'MediaPreviousTrack':
        event.preventDefault()
        this.playbackStore.queueStore.previous()
        break

      // Seeking controls
      case 'ArrowRight':
        event.preventDefault()
        if (event.shiftKey) {
          this.playbackStore.seek(this.playbackStore.currentTime() + 30) // 30 seconds
        } else if (event.ctrlKey || event.metaKey) {
          this.playbackStore.seek(this.playbackStore.currentTime() + 60) // 1 minute
        } else {
          this.playbackStore.seek(this.playbackStore.currentTime() + 10) // 10 seconds
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (event.shiftKey) {
          this.playbackStore.seek(this.playbackStore.currentTime() - 30) // 30 seconds
        } else if (event.ctrlKey || event.metaKey) {
          this.playbackStore.seek(this.playbackStore.currentTime() - 60) // 1 minute
        } else {
          this.playbackStore.seek(this.playbackStore.currentTime() - 10) // 10 seconds
        }
        break
      case 'Home':
        event.preventDefault()
        this.playbackStore.seek(0)
        break
      case 'End':
        event.preventDefault()
        this.playbackStore.seek(this.playbackStore.currentDuration())
        break

      // Volume controls
      case 'ArrowUp':
        event.preventDefault()
        if (event.shiftKey) {
          this.playbackStore.setVolume(Math.min(1, this.playbackStore.volume() + 0.05)) // 5% increment
        } else {
          this.playbackStore.setVolume(Math.min(1, this.playbackStore.volume() + 0.1)) // 10% increment
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (event.shiftKey) {
          this.playbackStore.setVolume(Math.max(0, this.playbackStore.volume() - 0.05)) // 5% increment
        } else {
          this.playbackStore.setVolume(Math.max(0, this.playbackStore.volume() - 0.1)) // 10% increment
        }
        break
      case 'MediaVolumeUp':
        event.preventDefault()
        this.playbackStore.setVolume(Math.min(1, this.playbackStore.volume() + 0.1))
        break
      case 'MediaVolumeDown':
        event.preventDefault()
        this.playbackStore.setVolume(Math.max(0, this.playbackStore.volume() - 0.1))
        break
      case 'MediaVolumeMute':
        event.preventDefault()
        this.playbackStore.toggleMute()
        break

      // Playback mode controls
      case 'm':
      case 'M':
        event.preventDefault()
        this.playbackStore.toggleMute()
        break
      case 'r':
      case 'R':
        event.preventDefault()
        this.playbackStore.queueStore.toggleRepeat()
        break
      case 's':
      case 'S':
        event.preventDefault()
        this.playbackStore.queueStore.toggleShuffle()
        break

      // Track navigation (letter keys)
      case 'n':
      case 'N':
        event.preventDefault()
        this.playbackStore.queueStore.next()
        break
      case 'p':
      case 'P':
        event.preventDefault()
        this.playbackStore.queueStore.previous()
        break
      default:
        break
    }
  }

  private togglePlay(): void {
    if (this.playbackStore.status() === PLAYBACK_STATUS.Playing) {
      this.playbackStore.pause()
    } else {
      this.playbackStore.play()
    }
  }
}

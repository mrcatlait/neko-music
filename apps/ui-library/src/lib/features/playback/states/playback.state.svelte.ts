import { onDestroy } from 'svelte'
import { REPEAT_OPTIONS, type RepeatOption } from '../enums/repeat-option.enum'
import { PLAYBACK_STATUS, type PlaybackStatus } from '../enums'
import type { Track } from '@/shared/models'
import { AudioService } from '@/features/player/services'

export class PlaybackState {
  private readonly audioService = new AudioService()

  currentTrack = $state<Track | null>(null)
  queue = $state<Track[]>([])
  shuffledQueue = $state<Track[]>([])

  // Queue management
  repeat = $state<RepeatOption>(REPEAT_OPTIONS.None)
  shuffle = $state<boolean>(false)

  // Playback status
  status = $state<PlaybackStatus>(PLAYBACK_STATUS.Pending)

  // Playback controls
  volume = $state<number>(50)
  muted = $state<boolean>(false)
  currentTime = $state<number>(0) // in seconds

  // Playback progress
  private readonly currentTrackIndex = $derived(
    this.shuffledQueue.findIndex((track) => track.id === this.currentTrack?.id),
  )
  hasPrevious = $derived(this.currentTrackIndex > 0 || this.repeat === REPEAT_OPTIONS.All)
  hasNext = $derived(this.currentTrackIndex < this.shuffledQueue.length - 1 || this.repeat === REPEAT_OPTIONS.All)

  constructor() {
    onDestroy(() => {
      // Clear
    })
  }

  next(): void {
    if (!this.hasNext) {
      return
    }

    let nextTrack: Track | null = null

    if (this.currentTrackIndex < this.queue.length - 1) {
      nextTrack = this.queue[this.currentTrackIndex + 1]
    } else {
      nextTrack = this.queue[0]
    }

    this.loadTrack(nextTrack)
  }

  previous(): void {
    if (!this.hasPrevious) {
      return
    }

    let nextTrack: Track | null = null

    if (this.currentTrackIndex > 0) {
      nextTrack = this.queue[this.currentTrackIndex - 1]
    } else {
      nextTrack = this.queue[this.queue.length - 1]
    }

    this.loadTrack(nextTrack)
  }

  toggleRepeat(): void {
    switch (this.repeat) {
      case REPEAT_OPTIONS.None:
        this.repeat = REPEAT_OPTIONS.All
        break
      case REPEAT_OPTIONS.All:
        this.repeat = REPEAT_OPTIONS.Single
        break
      case REPEAT_OPTIONS.Single:
      default:
        this.repeat = REPEAT_OPTIONS.None
        break
    }
  }

  toggleShuffle(): void {
    this.shuffle = !this.shuffle
  }

  setVolume(volume: number): void {
    this.volume = volume

    this.audioService.setVolume(volume)
  }

  private loadTrack(track: Track): void {
    this.currentTrack = track
    this.status = PLAYBACK_STATUS.Loading
    this.currentTime = 0
    this.audioService.setSource(track.url)
  }
}

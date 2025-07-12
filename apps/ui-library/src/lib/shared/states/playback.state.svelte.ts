import { BrowserOnlyMethod } from '../decorators'
import { PLAYBACK_STATUS, REPEAT_MODE, type PlaybackStatus } from '../enums'
import { AudioService } from '../services'
import { QueueDomainObject } from './queue.domain-object.svelte'

export class PlaybackState {
  readonly queue = new QueueDomainObject()

  status = $state<PlaybackStatus>(PLAYBACK_STATUS.None)
  volume = $state<number>(50)
  muted = $state<boolean>(false)
  currentTime = $state<number>(0)
  readonly currentDuration = $derived(this.queue.currentTrack?.duration ?? 0)

  constructor(private readonly audioService = AudioService.getInstance()) {
    this.registerEventListeners()
    this.watchCurrentTrack()
  }

  play(): void {
    this.status = PLAYBACK_STATUS.Playing
    this.audioService.play()
  }

  pause(): void {
    this.status = PLAYBACK_STATUS.Paused
    this.audioService.pause()
  }

  seek(time: number): void {
    if (time < 0) {
      this.currentTime = 0
    } else {
      this.currentTime = Math.min(time, this.currentDuration)
    }

    this.audioService.seek(this.currentTime)
  }

  setVolume(volume: number): void {
    this.volume = volume
    this.muted = volume === 0
    this.audioService.setVolume(volume)
  }

  toggleMute(): void {
    this.muted = !this.muted
    this.audioService.setMute(this.muted)

    if (!this.muted && this.volume === 0) {
      this.setVolume(10)
    }
  }

  @BrowserOnlyMethod
  private registerEventListeners(): void {
    this.audioService.onPlaybackTimeUpdated((event) => {
      this.currentTime = event.time ?? 0
    })

    this.audioService.onManifestLoaded(() => {
      this.play()
    })

    this.audioService.onPlaybackEnded(() => {
      switch (this.queue.repeat) {
        case REPEAT_MODE.Single:
          this.play()
          break
        case REPEAT_MODE.All:
          this.queue.next()
          break
        case REPEAT_MODE.None:
          if (this.queue.hasNext) {
            this.queue.next()
          }
          break
      }
    })

    this.audioService.onManifestLoadingStarted(() => {
      this.status = PLAYBACK_STATUS.Loading
    })
  }

  /**
   * Watches for current track changes and loads them into the audio service
   */
  @BrowserOnlyMethod
  private watchCurrentTrack(): void {
    $effect(() => {
      const currentTrack = this.queue.currentTrack

      if (currentTrack) {
        this.status = PLAYBACK_STATUS.Loading
        this.audioService.loadTrack(currentTrack.id)
      }
    })
  }
}

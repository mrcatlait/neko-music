import { AudioService } from '../services'

const PLAYBACK_STATUS = {
  Pending: 'pending',
  Playing: 'playing',
  Paused: 'paused',
  Ended: 'ended',
  Loading: 'loading',
} as const

type PlaybackStatus = (typeof PLAYBACK_STATUS)[keyof typeof PLAYBACK_STATUS]

export class PlaybackState {
  status = $state<PlaybackStatus>(PLAYBACK_STATUS.Pending)

  volume = $state<number>(50)
  muted = $state<boolean>(false)
  currentTime = $state<number>(0)

  constructor(
    private readonly audioService = new AudioService({
      onPlaybackTimeUpdate: (event) => {
        this.currentTime = event.time ?? 0
      },
      onCanPlay: () => {
        this.status = PLAYBACK_STATUS.Playing
      },
      onPlaybackEnded: () => {
        this.ended()
      },
    }),
  ) {}

  play(): void {
    this.status = PLAYBACK_STATUS.Playing
    this.audioService.play()
  }

  pause(): void {
    this.status = PLAYBACK_STATUS.Paused
    this.audioService.pause()
  }

  togglePlay(): void {
    switch (this.status) {
      case PLAYBACK_STATUS.Playing:
        return this.pause()
      case PLAYBACK_STATUS.Paused:
        return this.play()
      default:
        return
    }
  }

  seek(time: number): void {
    this.currentTime = time
    this.audioService.seek(time)
  }

  setVolume(volume: number): void {
    this.volume = volume
    this.muted = volume === 0
    this.audioService.setVolume(volume)
  }

  toggleMute(): void {
    this.muted = !this.muted || this.volume === 0
    this.audioService.setMute(this.muted)
  }
}

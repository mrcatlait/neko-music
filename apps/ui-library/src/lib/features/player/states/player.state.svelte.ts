import { PLAYER_STATUS, type PlayerStatus } from '../enums/player-status.enum'
import { AudioService } from '../services'

export class PlayerState {
  private readonly audioService = new AudioService({
    onPlaybackTimeUpdate: (event) => {
      this.currentTime = event.time ?? 0
    },
    onCanPlay: () => {
      this.status = PLAYER_STATUS.Playing
    },
    onPlaybackEnded: () => {
      this.status = PLAYER_STATUS.Paused
    },
  })

  volume = $state<number>(50)
  muted = $state<boolean>(false)
  currentTime = $state<number>(0)
  status = $state<PlayerStatus>(PLAYER_STATUS.Pending)

  play(): void {
    this.status = PLAYER_STATUS.Playing
    this.audioService.play()
  }

  pause(): void {
    this.status = PLAYER_STATUS.Paused
  }

  togglePlay(): void {
    switch (this.status) {
      case PLAYER_STATUS.Playing:
        return this.pause()
      case PLAYER_STATUS.Paused:
        return this.play()
      default:
        return
    }
  }

  seek(payload: { time: number }): void {
    this.currentTime = payload.time
  }

  setVolume(payload: { volume: number }): void {
    this.volume = payload.volume
    this.muted = payload.volume === 0
  }

  toggleMute(): void {
    this.muted = !this.muted || this.volume === 0
  }
}

import { PlayerStatus } from '../enums/player-status.enum';
import { AudioService } from '../services/audio.service';

export class PlayerState {
  private readonly audioService = new AudioService();

  volume = $state<number>(50);
  muted = $state<boolean>(false);
  currentTime = $state<number>(0);
  status = $state<PlayerStatus>(PlayerStatus.Pending);

  play(): void {
    this.status = PlayerStatus.Playing;
    this.audioService.play();
  }

  pause(): void {
    this.status = PlayerStatus.Paused;
  }

  togglePlay(): void {
    switch (this.status) {
      case PlayerStatus.Playing:
        return this.pause()
      case PlayerStatus.Paused:
        return this.play()
      default:
        return
    }
  }

  seek(payload: { time: number }): void {
    this.currentTime = payload.time;
  }

  setVolume(payload: { volume: number }): void {
    this.volume = payload.volume;
    this.muted = payload.volume === 0;
  }

  toggleMute(): void {
    this.muted = !this.muted || this.volume === 0;
  }
}

import { Injectable } from '@angular/core'
import { PlaybackTimeUpdatedEvent, MediaPlayerClass, MediaPlayer } from 'dashjs'

const DASH_EVENTS = {
  PlaybackTimeUpdated: 'playbackTimeUpdated',
  CanPlay: 'canPlay',
  PlaybackEnded: 'playbackEnded',
  ManifestLoadingStarted: 'manifestLoadingStarted',
  ManifestLoaded: 'manifestLoaded',
} as const

@Injectable({
  providedIn: 'root',
})
export class Player {
  private readonly audio = new Audio()
  private readonly player: MediaPlayerClass = MediaPlayer().create()

  constructor() {
    this.player.initialize(this.audio, undefined, false)
    this.player.setXHRWithCredentialsForType('', true)
  }

  play(): void {
    this.player.play()
  }

  pause(): void {
    if (!this.player.isPaused()) {
      this.player.pause()
    }
  }

  setSource(url: string): void {
    this.player.attachSource(url)
  }

  setVolume(volume: number) {
    if (this.player.isMuted()) {
      this.player.setMute(false)
    }

    if (volume === 0) {
      this.player.setMute(true)
    }

    this.player.setVolume(Number((volume / 100).toFixed(2)))
  }

  setMute(muted: boolean) {
    this.player.setMute(muted)
  }

  seek(time: number): void {
    this.player.seek(time)
  }

  onPlaybackTimeUpdated(callback: (event: PlaybackTimeUpdatedEvent) => void): void {
    this.player.on(DASH_EVENTS.PlaybackTimeUpdated, callback)
  }

  onCanPlay(callback: () => void): void {
    this.player.on(DASH_EVENTS.CanPlay, callback)
  }

  onPlaybackEnded(callback: () => void): void {
    this.player.on(DASH_EVENTS.PlaybackEnded, callback)
  }

  onManifestLoadingStarted(callback: () => void): void {
    this.player.on(DASH_EVENTS.ManifestLoadingStarted, callback)
  }

  onManifestLoaded(callback: () => void): void {
    this.player.on(DASH_EVENTS.ManifestLoaded, callback)
  }
}

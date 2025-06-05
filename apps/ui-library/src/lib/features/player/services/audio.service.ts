import { BrowserOnly } from '$lib/shared/decorators/browser-only.decorator'
import type { MediaPlayerClass, PlaybackTimeUpdatedEvent } from 'dashjs'
import { onDestroy } from 'svelte'

const DASH_EVENTS = {
  PLAYBACK_TIME_UPDATED: 'playbackTimeUpdated',
  MANIFEST_LOADED: 'manifestLoaded',
  CAN_PLAY: 'canPlay',
  PLAYBACK_ENDED: 'playbackEnded',
}

@BrowserOnly
export class AudioService {
  private readonly audio = new Audio()
  private player: MediaPlayerClass | null = null

  constructor() {
    import('dashjs').then(({ MediaPlayer }) => {
      this.player = MediaPlayer().create()
      this.player.initialize(this.audio, undefined, false)
      this.player.setXHRWithCredentialsForType('', true)
      this.registerEvents()
    })

    onDestroy(() => {
      this.removeEvents()
      this.player?.destroy()
      this.audio.remove()
    });
  }

  play(): void {
    if (this.player?.isPaused()) {
      this.player?.play()
    }
  }

  pause(): void {
    if (!this.player?.isPaused()) {
      this.player?.pause()
    }
  }

  setSource(url: string): void {
    this.player?.attachSource(url)
  }
  
  setVolume(volume: number) {
    if (this.player?.isMuted()) {
      this.player?.setMute(false)
    }

    if (volume === 0) {
      this.player?.setMute(true)
    }

    this.player?.setVolume(Number((volume / 100).toFixed(2)))
  }

  toggleMute() {
    this.player?.setMute(!this.player?.isMuted())
  }

  seek(time: number): void {
    this.player?.seek(time)
  }

  private registerEvents() {
    if (!this.player) {
      return
    }

    this.player.on(DASH_EVENTS.CAN_PLAY, this.onCanPlay)
    this.player.on(DASH_EVENTS.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.on(DASH_EVENTS.PLAYBACK_ENDED, this.onPlaybackEnded)
  }

  private removeEvents() {
    if (!this.player) {
      return
    }

    this.player.off(DASH_EVENTS.CAN_PLAY, this.onCanPlay)
    this.player.off(DASH_EVENTS.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.off(DASH_EVENTS.PLAYBACK_ENDED, this.onPlaybackEnded) 
  }

  private readonly onPlaybackTimeUpdate = (event: PlaybackTimeUpdatedEvent) => {
    const currentTime = event.time ?? 0
    // this.injector.get(AudioState).setTime({ time: Math.floor(currentTime) })
  }

  private readonly onCanPlay = () => {
    // this.injector.get(AudioState).play()
  }

  private readonly onPlaybackEnded = () => {
    // this.injector.get(PlaybackState).ended()
  }
}

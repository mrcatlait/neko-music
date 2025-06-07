import { BrowserOnly } from '@/shared/decorators'
import type { MediaPlayerClass, PlaybackTimeUpdatedEvent } from 'dashjs'
import { onDestroy } from 'svelte'

const DASH_EVENTS = {
  PlaybackTimeUpdated: 'playbackTimeUpdated',
  ManifestLoaded: 'manifestLoaded',
  CanPlay: 'canPlay',
  PlaybackEnded: 'playbackEnded',
} as const

interface AudioServiceOptions {
  /**
   * Callback function to handle playback time update events
   * @param event - The event object containing the playback time update
   * @returns void
   */
  onPlaybackTimeUpdate: (event: PlaybackTimeUpdatedEvent) => void
  /**
   * Callback function to handle playback can play events
   * @returns void
   */
  onCanPlay: () => void
  /**
   * Callback function to handle playback ended events
   * @returns void
   */
  onPlaybackEnded: () => void
}

@BrowserOnly
export class AudioService {
  private readonly audio = new Audio()
  private player: MediaPlayerClass | null = null

  constructor(private readonly options: AudioServiceOptions) {
    import('dashjs').then(({ MediaPlayer }) => {
      this.player = MediaPlayer().create()
      this.player.initialize(this.audio, undefined, false)
      this.player.setXHRWithCredentialsForType('', true)
      this.registerEvents()
    })

    // onDestroy(() => {
    //   this.removeEvents()
    //   this.player?.destroy()
    //   this.audio.remove()
    // })
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

  setMute(muted: boolean) {
    this.player?.setMute(muted)
  }

  seek(time: number): void {
    this.player?.seek(time)
  }

  private registerEvents() {
    if (!this.player) {
      return
    }

    this.player.on(DASH_EVENTS.CanPlay, this.options.onCanPlay)
    this.player.on(DASH_EVENTS.PlaybackTimeUpdated, this.options.onPlaybackTimeUpdate)
    this.player.on(DASH_EVENTS.PlaybackEnded, this.options.onPlaybackEnded)
  }

  private removeEvents() {
    if (!this.player) {
      return
    }

    this.player.off(DASH_EVENTS.CanPlay, this.options.onCanPlay)
    this.player.off(DASH_EVENTS.PlaybackTimeUpdated, this.options.onPlaybackTimeUpdate)
    this.player.off(DASH_EVENTS.PlaybackEnded, this.options.onPlaybackEnded)
  }
}

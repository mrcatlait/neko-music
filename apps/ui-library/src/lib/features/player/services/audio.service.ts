import { BrowserOnly } from '$lib/utils/browser-only'
import type { MediaPlayerClass } from 'dashjs'
import { onDestroy } from 'svelte'

@BrowserOnly
export class AudioService {
  private readonly audio = new Audio()
  private player: MediaPlayerClass | null = null

  constructor() {
    import('dashjs').then(({ MediaPlayer }) => {
      this.player = MediaPlayer().create()
      this.player.initialize(this.audio, undefined, false)
      this.player.setXHRWithCredentialsForType('', true)
    })

    onDestroy(() => {
      this.player?.destroy()
      this.audio.remove()
    });
  }

  play(): void {
    console.log('play', this.player)
    // if (this.player?.isPaused()) {
    //   this.player?.play()
    // }
  }

  pause(): void {
    if (!this.player?.isPaused()) {
      this.player?.pause()
    }
  }

  setSource(url: string): void {
    this.player?.attachSource(url)
  }

  getDuration(): number {
    return this.player?.duration() ?? 0
  }

  getCurrentTime(): number {
    return this.player?.time() ?? 0
  }

  seek(time: number): void {
    this.player?.seek(time)
  }
}

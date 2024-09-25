import { Injectable, Injector, OnDestroy, inject } from '@angular/core'
import { MediaPlayer, PlaybackTimeUpdatedEvent } from 'dashjs'

import { AudioState, PlaybackState } from '@core/state'
import { API_URL } from '@core/tokens'

export enum AudioEvents {
  PLAYBACK_TIME_UPDATED = 'playbackTimeUpdated',
  MANIFEST_LOADED = 'manifestLoaded',
  PLAYBACK_ENDED = 'playbackEnded',
}

@Injectable({
  providedIn: 'root',
})
export class AudioService implements OnDestroy {
  private readonly apiUrl = inject(API_URL)
  private readonly audio = new Audio()
  private readonly injector = inject(Injector)
  private readonly player = MediaPlayer().create()

  constructor() {
    this.player.initialize(this.audio, undefined, false)
    this.registerEvents()
  }

  ngOnDestroy() {
    this.removeEvents()
    this.audio.remove()
    this.player.destroy()
  }

  play() {
    this.player.play()
  }

  pause() {
    this.player.pause()
  }

  seek(seconds: number) {
    this.player.seek(seconds)
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

  toggleMute() {
    this.player.setMute(!this.player.isMuted())
  }

  load(trackId: string) {
    this.player.attachSource(`${this.apiUrl}/tracks/${trackId}/stream/manifest.mpd`)
  }

  private registerEvents() {
    this.player.on(AudioEvents.MANIFEST_LOADED, this.onManifestLoaded)
    this.player.on(AudioEvents.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.on(AudioEvents.PLAYBACK_ENDED, this.onPlaybackEnded)
  }

  private removeEvents() {
    this.player.off(AudioEvents.MANIFEST_LOADED, this.onManifestLoaded)
    this.player.off(AudioEvents.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.off(AudioEvents.PLAYBACK_ENDED, this.onPlaybackEnded)
  }

  private readonly onPlaybackTimeUpdate = (event: PlaybackTimeUpdatedEvent) => {
    const currentTime = event.time ?? 0
    this.injector.get(AudioState).setTime({ time: Math.floor(currentTime) })
  }

  private readonly onManifestLoaded = () => {
    this.injector.get(AudioState).play()
  }

  private readonly onPlaybackEnded = () => {
    this.injector.get(PlaybackState).ended()
  }
}

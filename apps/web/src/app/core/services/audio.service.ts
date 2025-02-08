import { Injectable, Injector, OnDestroy, inject } from '@angular/core'
import { MediaPlayer, PlaybackTimeUpdatedEvent } from 'dashjs'
import { injectEnvironment } from '@neko/ui-shared/providers'

import { AudioState, PlaybackState } from '@core/states'

export enum AudioEvents {
  PLAYBACK_TIME_UPDATED = 'playbackTimeUpdated',
  MANIFEST_LOADED = 'manifestLoaded',
  CAN_PLAY = 'canPlay',
  PLAYBACK_ENDED = 'playbackEnded',
}

@Injectable({
  providedIn: 'root',
})
export class AudioService implements OnDestroy {
  private readonly environment = injectEnvironment()
  private readonly audio = new Audio()
  private readonly injector = inject(Injector)
  private readonly player = MediaPlayer().create()

  constructor() {
    this.player.initialize(this.audio, undefined, false)
    this.player.setXHRWithCredentialsForType('', true)
    this.registerEvents()
  }

  ngOnDestroy() {
    this.removeEvents()
    this.audio.remove()
    this.player.destroy()
  }

  play() {
    if (this.player.isPaused()) {
      this.player.play()
    }
  }

  pause() {
    if (!this.player.isPaused()) {
      this.player.pause()
    }
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
    this.player.attachSource(`${this.environment.apiUrl}/tracks/${trackId}/stream/manifest`)
  }

  private registerEvents() {
    this.player.on(AudioEvents.CAN_PLAY, this.onCanPlay)
    this.player.on(AudioEvents.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.on(AudioEvents.PLAYBACK_ENDED, this.onPlaybackEnded)
  }

  private removeEvents() {
    this.player.off(AudioEvents.CAN_PLAY, this.onCanPlay)
    this.player.off(AudioEvents.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.off(AudioEvents.PLAYBACK_ENDED, this.onPlaybackEnded)
  }

  private readonly onPlaybackTimeUpdate = (event: PlaybackTimeUpdatedEvent) => {
    const currentTime = event.time ?? 0
    this.injector.get(AudioState).setTime({ time: Math.floor(currentTime) })
  }

  private readonly onCanPlay = () => {
    this.injector.get(AudioState).play()
  }

  private readonly onPlaybackEnded = () => {
    this.injector.get(PlaybackState).ended()
  }
}

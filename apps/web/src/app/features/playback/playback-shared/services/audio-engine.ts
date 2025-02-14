import { inject, Injectable, OnDestroy } from '@angular/core'
import { MediaPlayer, PlaybackTimeUpdatedEvent } from 'dashjs'
import { injectEnvironment } from '@neko/ui-shared/providers'

import { PlaybackEventHandler } from './playback-event-handler'
import { PlaybackEventType } from '../enums'

enum AudioEvents {
  PLAYBACK_TIME_UPDATED = 'playbackTimeUpdated',
  MANIFEST_LOADED = 'manifestLoaded',
  CAN_PLAY = 'canPlay',
  PLAYBACK_ENDED = 'playbackEnded',
}

@Injectable({
  providedIn: 'root',
})
export class AudioEngine implements OnDestroy {
  private readonly audio = new Audio()
  private readonly playbackEventHandler = inject(PlaybackEventHandler)
  private readonly player = MediaPlayer().create()
  private readonly environment = injectEnvironment()

  private readonly onPlaybackTimeSeek = this.playbackEventHandler.on(PlaybackEventType.PlaybackTimeSeek, (payload) => {
    this.player.seek(payload.time)
  })

  private readonly onVolumeUpdated = this.playbackEventHandler.on(PlaybackEventType.VolumeUpdated, (payload) => {
    this.player.setVolume(Number((payload.volume / 100).toFixed(2)))
  })

  private readonly onMuteToggled = this.playbackEventHandler.on(PlaybackEventType.MuteToggled, (payload) => {
    this.player.setMute(payload.muted)
  })

  private readonly onPlaybackStarted = this.playbackEventHandler.on(PlaybackEventType.PlaybackStarted, () => {
    this.player.play()

    // if (this.player.isPaused()) {
    //   this.player.play()
    // }
  })

  private readonly onTrackSelected = this.playbackEventHandler.on(PlaybackEventType.TrackSelected, (payload) => {
    this.player.attachSource(`${this.environment.apiUrl}/tracks/${payload.track.id}/stream/manifest`)
  })

  private readonly onPlaybackPaused = this.playbackEventHandler.on(PlaybackEventType.PlaybackPaused, () => {
    this.player.pause()

    // if (!this.player.isPaused()) {
    //   this.player.pause()
    // }
  })

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

  // setVolume(volume: number) {
  //   if (this.player.isMuted()) {
  //     this.player.setMute(false)
  //   }

  //   if (volume === 0) {
  //     this.player.setMute(true)
  //   }

  //   this.player.setVolume(Number((volume / 100).toFixed(2)))
  // }

  private registerEvents() {
    this.player.on(AudioEvents.CAN_PLAY, this.onTrackLoaded)
    this.player.on(AudioEvents.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.on(AudioEvents.PLAYBACK_ENDED, this.onTrackEnded)
  }

  private removeEvents() {
    this.player.off(AudioEvents.CAN_PLAY, this.onTrackLoaded)
    this.player.off(AudioEvents.PLAYBACK_TIME_UPDATED, this.onPlaybackTimeUpdate)
    this.player.off(AudioEvents.PLAYBACK_ENDED, this.onTrackEnded)
    this.onPlaybackTimeSeek()
    this.onVolumeUpdated()
    this.onMuteToggled()
    this.onPlaybackStarted()
    this.onPlaybackPaused()
    this.onTrackSelected()
  }

  private readonly onPlaybackTimeUpdate = (event: PlaybackTimeUpdatedEvent) => {
    const currentTime = event.time ?? 0
    this.playbackEventHandler.timeUpdated({ time: Math.floor(currentTime) })
  }

  private readonly onTrackLoaded = () => {
    this.playbackEventHandler.trackLoaded()
  }

  private readonly onTrackEnded = () => {
    this.playbackEventHandler.trackEnded()
  }
}

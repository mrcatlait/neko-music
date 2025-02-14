import { inject, Injectable, OnDestroy, signal } from '@angular/core'

import { PlaybackEventHandler } from './playback-event-handler'
import { PlaybackEventType, PlayerStatus } from '../enums'

import { Track } from '@core/interfaces'

@Injectable({ providedIn: 'root' })
export class PlaybackState implements OnDestroy {
  private readonly playbackEventHandler = inject(PlaybackEventHandler)

  readonly currentTrack = signal<Track | null>(null)
  readonly status = signal(PlayerStatus.Pending)

  private readonly onTrackLoaded = this.playbackEventHandler.on(PlaybackEventType.TrackLoaded, () => {
    this.play()
  })

  private readonly onTrackSelected = this.playbackEventHandler.on(PlaybackEventType.TrackSelected, (payload) => {
    this.status.set(PlayerStatus.Loading)
    this.currentTrack.set(payload.track)
  })

  ngOnDestroy() {
    this.onTrackLoaded()
    this.onTrackSelected()
  }

  togglePlay(track: Track): void {
    const isSameTrack = this.currentTrack()?.id === track.id

    if (!isSameTrack) {
      this.playbackEventHandler.trackSelected({ track })
      return
    }

    switch (this.status()) {
      case PlayerStatus.Playing:
        return this.pause()
      case PlayerStatus.Paused:
        return this.play()
      default:
        return
    }
  }

  play(): void {
    this.status.set(PlayerStatus.Playing)
    this.playbackEventHandler.playbackStarted()
  }

  pause(): void {
    this.status.set(PlayerStatus.Paused)
    this.playbackEventHandler.playbackPaused()
  }
}

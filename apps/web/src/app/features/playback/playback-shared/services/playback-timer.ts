import { inject, Injectable, OnDestroy, signal } from '@angular/core'

import { PlaybackEventHandler } from './playback-event-handler'
import { PlaybackEventType } from '../enums'

@Injectable({
  providedIn: 'root',
})
export class PlaybackTimer implements OnDestroy {
  private readonly playbackEventHandler = inject(PlaybackEventHandler)

  readonly currentTime = signal(0)

  private readonly onPlaybackTimeUpdated = this.playbackEventHandler.on(
    PlaybackEventType.PlaybackTimeUpdated,
    (payload) => {
      this.currentTime.set(payload.time)
    },
  )

  ngOnDestroy() {
    this.onPlaybackTimeUpdated()
  }

  seek(time: number): void {
    this.playbackEventHandler.timeSeek({ time })
  }
}

import { inject, Injectable, signal } from '@angular/core'

import { CookieVolumeStorage } from './cookie-volume-storage'
import { PlaybackEventHandler } from './playback-event-handler'

const DEFAULT_VOLUME = 30

@Injectable({
  providedIn: 'root',
})
export class VolumeManage {
  private readonly playbackEventHandler = inject(PlaybackEventHandler)
  private readonly cookieVolumeStorage = inject(CookieVolumeStorage)

  readonly muted = signal(false)
  readonly volume = signal(DEFAULT_VOLUME)

  constructor() {
    this.initializeVolume()
  }

  setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(100, volume))

    this.cookieVolumeStorage.saveVolume(normalizedVolume)

    this.volume.set(normalizedVolume)
    this.setMuted(normalizedVolume === 0)

    this.playbackEventHandler.volumeUpdated({ volume: normalizedVolume })
  }

  setMuted(muted: boolean): void {
    this.muted.set(muted)
    this.playbackEventHandler.muteToggled({ muted })
  }

  private initializeVolume(): void {
    const volume = this.cookieVolumeStorage.loadVolume() ?? DEFAULT_VOLUME
    this.setVolume(volume)
  }
}

import { Injectable, computed, inject, signal } from '@angular/core'
import { CookieService, SeoService } from '@neko/ui-shared/services'

import { PlayerStatus } from '@core/enums'
import { Track, StateModel } from '@core/interfaces'
import { AudioService } from '@core/services'

const VOLUME_COOKIE = 'volume'

interface AudioStateModel {
  track: Track | null
  status: PlayerStatus
  muted: boolean
  volume: number
  currentTime: number
}

@Injectable({
  providedIn: 'root',
})
export class AudioState implements StateModel<AudioStateModel> {
  private readonly seoService = inject(SeoService)
  private readonly cookieService = inject(CookieService)
  private readonly audioService = inject(AudioService)

  readonly track = signal<Track | null>(null)
  readonly status = signal(PlayerStatus.Pending)
  readonly muted = signal(false)
  readonly volume = signal(50)
  readonly currentTime = signal(0)

  readonly active = computed(() => this.status() !== PlayerStatus.Pending)
  readonly playing = computed(() => this.status() === PlayerStatus.Playing)
  readonly duration = computed(() => this.track()?.duration ?? 0)

  constructor() {
    const volume = this.cookieService.get(VOLUME_COOKIE) ?? 30

    if (volume) {
      this.setVolume({ volume: Number(volume) })
    }
  }

  load(payload: { track: Track }): void {
    this.status.set(PlayerStatus.Loading)
    this.currentTime.set(0)
    this.track.set(payload.track)

    this.audioService.load(payload.track.id)
  }

  play(): void {
    this.status.set(PlayerStatus.Playing)

    this.seoService.setTitle(this.track()?.title)
    this.audioService.play()
  }

  pause(): void {
    this.status.set(PlayerStatus.Paused)

    this.seoService.resetTitle()
    this.audioService.pause()
  }

  togglePlay(): void {
    switch (this.status()) {
      case PlayerStatus.Playing:
        return this.pause()
      case PlayerStatus.Paused:
        return this.play()
      default:
        return
    }
  }

  seek(payload: { time: number }): void {
    this.currentTime.set(payload.time)

    this.audioService.seek(payload.time)
  }

  setTime(payload: { time: number }): void {
    this.currentTime.set(payload.time)
  }

  setVolume(payload: { volume: number }): void {
    this.cookieService.set({ name: VOLUME_COOKIE, value: String(payload.volume), expires: 30 })

    this.volume.set(payload.volume)
    this.muted.set(payload.volume === 0)

    this.audioService.setVolume(payload.volume)
  }

  toggleMute(): void {
    this.muted.set(!this.muted() || this.volume() === 0)

    this.audioService.toggleMute()
  }
}

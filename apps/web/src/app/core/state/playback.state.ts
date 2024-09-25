import { Injectable, computed, inject, signal } from '@angular/core'

import { AudioState } from './audio.state'
import { UIState } from './ui.state'

import { Track, Queue, StateModel } from '@core/models'
import { RepeatOption } from '@core/enum'
import { generateCompositeTrackId } from '@shared/utils'

interface PlaybackStateModel {
  currentTrack: Track | null
  queue: Queue
  shuffle: boolean
  repeat: RepeatOption
}

@Injectable({
  providedIn: 'root',
})
export class PlaybackState implements StateModel<PlaybackStateModel> {
  private readonly audioState = inject(AudioState)
  private readonly uiState = inject(UIState)

  readonly currentTrack = signal<Track | null>(null)
  readonly queue = signal<Queue>({ source: { name: '' }, tracks: [] })
  readonly shuffle = signal(false)
  readonly repeat = signal(RepeatOption.None)

  readonly hasPrevious = computed(
    () =>
      this.currentTrack() &&
      (this.queue().tracks.findIndex((track) => track.id === this.currentTrack()?.id) > 0 ||
        this.repeat() === RepeatOption.All),
  )

  readonly hasNext = computed(
    () =>
      this.currentTrack() &&
      (this.queue().tracks.findIndex((track) => track.id === this.currentTrack()?.id) <
        this.queue().tracks.length - 1 ||
        this.repeat() === RepeatOption.All),
  )

  readonly currentTrackId = computed(() => generateCompositeTrackId(this.queue(), this.currentTrack()))

  readonly queueSourceId = computed(() => this.queue().source.entityId)

  togglePlay(payload: { queue: Queue; trackId?: string }): void {
    if (this.currentTrack()?.id === payload.trackId && this.queue().source.entityId === payload.queue.source.entityId) {
      this.audioState.togglePlay()
      return
    }

    let track = payload.queue.tracks[0]

    if (payload.trackId) {
      track = payload.queue.tracks.find((r) => r.id === payload.trackId) || track
    }

    this.currentTrack.set(track)

    if (
      this.queue().source.entityId !== payload.queue.source.entityId ||
      this.queue().source.name !== payload.queue.source.name
    ) {
      this.queue.set(payload.queue)
    }

    this.audioState.load({ track })
    this.uiState.openVisualizer()
  }

  next(): void {
    const currentTrack = this.currentTrack()
    const queue = this.queue()

    if (!currentTrack) {
      return
    }

    const currentIndex = queue.tracks.findIndex((track) => track.id === currentTrack.id)
    let nextTrack: Track

    if (currentIndex < queue.tracks.length - 1) {
      nextTrack = queue.tracks[currentIndex + 1]
    } else {
      nextTrack = queue.tracks[0]
    }

    this.currentTrack.set(nextTrack)
    this.audioState.load({ track: nextTrack })
  }

  previous(): void {
    const currentTrack = this.currentTrack()
    const queue = this.queue()

    if (!currentTrack) {
      return
    }

    const currentIndex = queue.tracks.findIndex((track) => track.id === currentTrack.id)
    let previousTrack: Track

    if (currentIndex > 0) {
      previousTrack = queue.tracks[currentIndex - 1]
    } else {
      previousTrack = queue.tracks[queue.tracks.length - 1]
    }

    this.currentTrack.set(previousTrack)
    this.audioState.load({ track: previousTrack })
  }

  toggleRepeat(): void {
    switch (this.repeat()) {
      case RepeatOption.None:
        this.repeat.set(RepeatOption.All)
        break
      case RepeatOption.All:
        this.repeat.set(RepeatOption.Single)
        break
      case RepeatOption.Single:
      default:
        this.repeat.set(RepeatOption.None)
        break
    }
  }

  toggleShuffle(): void {
    this.shuffle.update((shuffle) => !shuffle)
  }

  ended(): void {
    const currentTrack = this.currentTrack()
    const queue = this.queue()

    switch (this.repeat()) {
      case RepeatOption.Single:
        this.audioState.play()
        break
      case RepeatOption.All:
        this.next()
        break
      case RepeatOption.None:
      default:
        if (currentTrack && queue.tracks.findIndex((track) => track.id === currentTrack.id) < queue.tracks.length - 1) {
          this.next()
        } else {
          this.audioState.pause()
        }
        break
    }
  }
}

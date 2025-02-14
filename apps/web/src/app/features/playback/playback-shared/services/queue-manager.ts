import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core'

import { PlaybackEventHandler } from './playback-event-handler'
import { PlaybackEventType, RepeatOption } from '../enums'
import { PlaybackState } from './playback-state'

import { Queue, Track } from '@core/interfaces'

@Injectable()
export class QueueManager implements OnDestroy {
  private readonly playbackEventHandler = inject(PlaybackEventHandler)
  private readonly playbackState = inject(PlaybackState)

  readonly shuffle = signal(false)
  readonly repeat = signal(RepeatOption.None)

  readonly tracks = computed(() => (this.shuffle() ? this.shuffleTracks(this.queue().tracks) : this.queue().tracks))

  readonly nextTrack = computed(() => this.getNextTrack(this.playbackState.currentTrack(), this.tracks()))
  readonly hasNext = computed(() => Boolean(this.nextTrack()))

  readonly previousTrack = computed(() => this.getPreviousTrack(this.playbackState.currentTrack(), this.tracks()))
  readonly hasPrevious = computed(() => Boolean(this.previousTrack()))

  private readonly queue = signal<Queue>({ tracks: [], source: { name: '' } })

  private readonly onTrackEnded = this.playbackEventHandler.on(PlaybackEventType.TrackEnded, () => {
    this.next()
  })

  ngOnDestroy() {
    this.onTrackEnded()
  }

  setQueue(queue: Queue): void {
    const isSameSource = this.queue().source.entityId === queue.source.entityId

    if (isSameSource) {
      return
    }

    this.repeat.set(RepeatOption.None)
    this.shuffle.set(false)
    this.queue.set(queue)
  }

  next(): void {
    const nextTrack = this.nextTrack()

    if (!nextTrack) {
      return
    }

    this.playbackEventHandler.trackSelected({ track: nextTrack })
  }

  previous(): void {
    const previousTrack = this.previousTrack()

    if (!previousTrack) {
      return
    }

    this.playbackEventHandler.trackSelected({ track: previousTrack })
  }

  toggleShuffle(): void {
    this.shuffle.update((shuffle) => !shuffle)
  }

  private getNextTrack(currentTrack: Track | null, tracks: Track[]): Track | null {
    if (!currentTrack) {
      return null
    }

    if (this.repeat() === RepeatOption.Single) {
      return currentTrack
    }

    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)

    if (currentIndex < tracks.length - 1) {
      return tracks[currentIndex + 1]
    }

    if (this.repeat() === RepeatOption.All) {
      return tracks[0]
    }

    return null
  }

  private getPreviousTrack(currentTrack: Track | null, tracks: Track[]): Track | null {
    if (!currentTrack) {
      return null
    }

    if (this.repeat() === RepeatOption.Single) {
      return currentTrack
    }

    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)

    if (currentIndex > 0) {
      return tracks[currentIndex - 1]
    }

    if (this.repeat() === RepeatOption.All) {
      return tracks[tracks.length - 1]
    }

    return null
  }

  private shuffleTracks(array: Track[]): Track[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

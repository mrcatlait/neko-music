import { computed, Injectable, signal } from '@angular/core'

import { REPEAT_MODE, RepeatMode } from '@/shared/enums'
import { Track } from '@/shared/entities'
import { shuffleArray } from '@/shared/utils'
import { Queue } from '@/shared/models'
import { TrackBuilder } from 'src/test-utils'

@Injectable({
  providedIn: 'root',
})
export class QueueStore {
  readonly tracks = signal<Track[]>([])
  readonly nextTracks = signal<Track[]>([])
  readonly currentTrack = signal<Track>(new TrackBuilder().build() as Track)

  readonly queueId = signal<string | null>(null)
  readonly queueName = signal<string | null>(null)
  readonly queueDescription = signal<string | null>(null)

  readonly repeat = signal<RepeatMode>(REPEAT_MODE.None)
  readonly shuffle = signal<boolean>(false)

  readonly currentTrackIndex = computed(() =>
    this.nextTracks().findIndex((track) => track.id === this.currentTrack()?.id),
  )

  readonly nextInQueue = computed(() => this.nextTracks().filter((_, index) => index > this.currentTrackIndex()))

  readonly hasNext = computed(
    () => this.currentTrackIndex() < this.nextTracks().length - 1 || this.repeat() === REPEAT_MODE.All,
  )
  readonly hasPrevious = computed(() => this.currentTrackIndex() > 0 || this.repeat() === REPEAT_MODE.All)

  async setQueue(queue: Queue<unknown>): Promise<void> {
    if (queue.id !== this.queueId()) {
      this.clear()

      const result = await queue.getResult()

      this.queueId.set(queue.id)
      this.tracks.set(result.tracks)
      this.nextTracks.set(queue.options.shuffle ? shuffleArray(result.tracks) : [...result.tracks])
      this.shuffle.set(queue.options.shuffle || false)

      this.queueName.set(result.metadata.name)
      this.queueDescription.set(result.metadata.description || '')
    }

    if (queue.options.startFromTrack) {
      const startTrack = this.nextTracks().find((track) => track.id === queue.options.startFromTrack)
      this.currentTrack.set(startTrack || this.nextTracks()[0])
    } else {
      this.currentTrack.set(this.nextTracks()[0])
    }
  }

  next(): void {
    if (!this.hasNext()) {
      return
    }

    if (this.currentTrackIndex() < this.nextTracks().length - 1) {
      this.currentTrack.set(this.nextTracks()[this.currentTrackIndex() + 1])
    } else {
      this.currentTrack.set(this.nextTracks()[0])
    }
  }

  previous(): void {
    if (!this.hasPrevious()) {
      return
    }

    if (this.currentTrackIndex() > 0) {
      this.currentTrack.set(this.nextTracks()[this.currentTrackIndex() - 1])
    } else {
      this.currentTrack.set(this.nextTracks()[this.nextTracks().length - 1])
    }
  }

  toggleRepeat(): void {
    switch (this.repeat()) {
      case REPEAT_MODE.None:
        this.repeat.set(REPEAT_MODE.All)
        break
      case REPEAT_MODE.All:
        this.repeat.set(REPEAT_MODE.Single)
        break
      case REPEAT_MODE.Single:
      default:
        this.repeat.set(REPEAT_MODE.None)
        break
    }
  }

  toggleShuffle(): void {
    this.shuffle.update((shuffle) => !shuffle)

    if (!this.tracks().length) {
      return
    }

    if (this.shuffle()) {
      this.nextTracks.set(shuffleArray(this.nextTracks()))
    } else {
      this.nextTracks.set([...this.tracks()])
    }
  }

  addToPlayNext(newTracks: Track[]): void {
    const targetPosition = this.currentTrackIndex() + 1
    this.nextTracks.update((nextTracks) => nextTracks.splice(targetPosition, 0, ...newTracks))

    const originalTargetPosition = this.tracks().findIndex((track) => track.id === this.currentTrack()?.id) + 1
    this.tracks.update((tracks) => tracks.splice(originalTargetPosition, 0, ...newTracks))
  }

  addToPlayLater(newTracks: Track[]): void {
    this.nextTracks.update((nextTracks) => [...nextTracks, ...newTracks])
    this.tracks.update((tracks) => [...tracks, ...newTracks])
  }

  private clear(): void {
    this.queueId.set(null)
    this.shuffle.set(false)
    this.currentTrack.set({} as Track)
    this.tracks.set([])
    this.nextTracks.set([])
    this.repeat.set(REPEAT_MODE.None)
    this.queueName.set(null)
    this.queueDescription.set(null)
  }
}

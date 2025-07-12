import { REPEAT_MODE, type RepeatMode } from '../enums'
import type { Track } from '../entities'
import { shuffleArray } from '../utils'
import type { Queue } from '../models'

export class QueueDomainObject {
  tracks = $state<Track[]>([])
  nextTracks = $state<Track[]>([])
  currentTrack = $state<Track | null>(null)

  queueId = $state<string>('')
  queueName = $state<string>('')
  queueDescription = $state<string>('')

  repeat = $state<RepeatMode>(REPEAT_MODE.None)
  shuffle = $state<boolean>(false)

  readonly currentTrackIndex = $derived(this.nextTracks.findIndex((track) => track.id === this.currentTrack?.id))

  readonly nextInQueue = $derived(this.nextTracks.filter((_, index) => index > this.currentTrackIndex))

  readonly hasNext = $derived(this.currentTrackIndex < this.nextTracks.length - 1 || this.repeat === REPEAT_MODE.All)
  readonly hasPrevious = $derived(this.currentTrackIndex > 0 || this.repeat === REPEAT_MODE.All)

  async setQueue(queue: Queue<unknown>): Promise<void> {
    if (queue.id !== this.queueId) {
      this.clear()

      const result = await queue.getResult()

      this.queueId = queue.id
      this.tracks = result.tracks
      this.nextTracks = queue.options.shuffle ? shuffleArray(result.tracks) : [...result.tracks]
      this.shuffle = queue.options.shuffle || false

      this.queueName = result.metadata.name
      this.queueDescription = result.metadata.description || ''
    }

    if (queue.options.startFromTrack) {
      const startTrack = this.nextTracks.find((track) => track.id === queue.options.startFromTrack)
      this.currentTrack = startTrack || this.nextTracks[0]
    } else {
      this.currentTrack = this.nextTracks[0]
    }
  }

  next(): void {
    if (!this.hasNext) {
      return
    }

    if (this.currentTrackIndex < this.nextTracks.length - 1) {
      this.currentTrack = this.nextTracks[this.currentTrackIndex + 1]
    } else {
      this.currentTrack = this.nextTracks[0]
    }
  }

  previous(): void {
    if (!this.hasPrevious) {
      return
    }

    if (this.currentTrackIndex > 0) {
      this.currentTrack = this.nextTracks[this.currentTrackIndex - 1]
    } else {
      this.currentTrack = this.nextTracks[this.nextTracks.length - 1]
    }
  }

  toggleRepeat(): void {
    switch (this.repeat) {
      case REPEAT_MODE.None:
        this.repeat = REPEAT_MODE.All
        break
      case REPEAT_MODE.All:
        this.repeat = REPEAT_MODE.Single
        break
      case REPEAT_MODE.Single:
      default:
        this.repeat = REPEAT_MODE.None
        break
    }
  }

  toggleShuffle(): void {
    this.shuffle = !this.shuffle

    if (!this.tracks.length) {
      return
    }

    if (this.shuffle) {
      this.nextTracks = shuffleArray(this.nextTracks)
    } else {
      this.nextTracks = [...this.tracks]
    }
  }

  addToPlayNext(tracks: Track[]): void {
    const targetPosition = this.currentTrackIndex + 1
    this.nextTracks.splice(targetPosition, 0, ...tracks)

    const originalTargetPosition = this.tracks.findIndex((track) => track.id === this.currentTrack?.id) + 1
    this.tracks.splice(originalTargetPosition, 0, ...tracks)
  }

  addToPlayLater(tracks: Track[]): void {
    this.nextTracks.push(...tracks)
    this.tracks.push(...tracks)
  }

  removeFromQueue(trackId: string): void {
    const trackIndex = this.nextTracks.findIndex((track) => track.id === trackId)
    if (trackIndex !== -1) {
      this.nextTracks.splice(trackIndex, 1)
    }

    const originalTrackIndex = this.tracks.findIndex((track) => track.id === trackId)
    if (originalTrackIndex !== -1) {
      this.tracks.splice(originalTrackIndex, 1)
    }
  }

  moveTrack(trackId: string, targetPosition: number): void {
    const trackIndex = this.nextTracks.findIndex((track) => track.id === trackId)
    if (trackIndex === -1) return

    const [track] = this.nextTracks.splice(trackIndex, 1)
    this.nextTracks.splice(targetPosition, 0, track)

    const originalTrackIndex = this.tracks.findIndex((t) => t.id === trackId)
    if (originalTrackIndex !== -1) {
      this.tracks.splice(originalTrackIndex, 1)
      this.tracks.splice(targetPosition, 0, track)
    }
  }

  private clear(): void {
    this.queueId = ''
    this.shuffle = false
    this.currentTrack = null
    this.tracks = []
    this.nextTracks = []
    this.repeat = REPEAT_MODE.None
    this.queueName = ''
    this.queueDescription = ''
  }
}

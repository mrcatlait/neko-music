import { PLAYBACK_STATUS, REPEAT_OPTIONS, type PlaybackStatus, type RepeatOption } from '../enums'
import type { Queue, Track } from '../models'
import { AudioService } from '../services'
import { shuffleArray } from '../utils'

const mockQueue = {
  id: '1',
  tracks: [
    { id: '1', title: 'Track 1', duration: 100, artists: [{ id: '1', name: 'Artist 1' }] },
    { id: '2', title: 'Track 2', duration: 200, artists: [{ id: '2', name: 'Artist 2' }] },
    { id: '3', title: 'Track 3', duration: 300, artists: [{ id: '3', name: 'Artist 3' }] },
  ],
} as Queue

export class PlaybackState {
  status = $state<PlaybackStatus>(PLAYBACK_STATUS.Pending)
  queue = $state<Queue | null>(mockQueue)

  tracks = $state<Track[]>(mockQueue.tracks)
  currentTrack = $state<Track | null>(mockQueue.tracks[0])

  volume = $state<number>(50)
  muted = $state<boolean>(false)
  currentTime = $state<number>(0)

  repeat = $state<RepeatOption>(REPEAT_OPTIONS.None)
  shuffle = $state<boolean>(false)

  private readonly currentItemIndex = $derived(this.tracks.findIndex((track) => track.id === this.currentTrack?.id))

  nextInQueue = $derived(this.tracks.filter((_, index) => index > this.currentItemIndex))

  hasNext = $derived(this.currentItemIndex < this.tracks.length - 1 || this.repeat === REPEAT_OPTIONS.All)
  hasPrevious = $derived(this.currentItemIndex > 0 || this.repeat === REPEAT_OPTIONS.All)

  constructor(
    private readonly audioService = new AudioService({
      onPlaybackTimeUpdate: (event) => {
        this.currentTime = event.time ?? 0
      },
      onCanPlay: () => {
        this.play()
      },
      onPlaybackEnded: () => {
        if (this.repeat === REPEAT_OPTIONS.Single) {
          this.pause()
        } else if (this.hasNext) {
          this.next()
        } else {
          this.pause()
        }
      },
    }),
  ) {}

  play(): void {
    this.status = PLAYBACK_STATUS.Playing
    this.audioService.play()
  }

  pause(): void {
    this.status = PLAYBACK_STATUS.Paused
    this.audioService.pause()
  }

  /**
   * Smart toggle method that handles all play/pause/queue switching logic
   * Call this method for any play button - it will automatically decide what to do
   * @param queue - Queue to play
   * @param trackId - Id of track to start playing
   */
  togglePlay(queue: Queue, trackId?: string): void {
    if (this.queue?.id === queue.id && (this.currentTrack?.id === trackId || !trackId)) {
      switch (this.status) {
        case PLAYBACK_STATUS.Playing:
          return this.pause()
        case PLAYBACK_STATUS.Paused:
          return this.play()
        default:
          return
      }
    }

    let track = queue.tracks[0]

    if (trackId) {
      track = queue.tracks.find((r) => r.id === trackId) || track
    }

    this.currentTrack = track

    if (this.queue?.id !== queue.id) {
      this.queue = queue
      this.tracks = queue.tracks
    }

    this.audioService.setSource(this.currentTrack.id)
  }

  seek(time: number): void {
    if (time < 0) {
      this.currentTime = 0
    } else {
      this.currentTime = Math.min(time, this.currentTrack?.duration ?? 0)
    }

    this.audioService.seek(this.currentTime)
  }

  setVolume(volume: number): void {
    this.volume = volume
    this.muted = volume === 0
    this.audioService.setVolume(volume)
  }

  toggleMute(): void {
    this.muted = !this.muted || this.volume === 0
    this.audioService.setMute(this.muted)
  }

  next(): void {
    if (!this.hasNext) {
      return
    }

    if (this.currentItemIndex < this.tracks.length - 1) {
      this.currentTrack = this.tracks[this.currentItemIndex + 1]
    } else {
      this.currentTrack = this.tracks[0]
    }

    this.audioService.setSource(this.currentTrack.id)
  }

  previous(): void {
    if (!this.hasPrevious) {
      return
    }

    if (this.currentItemIndex > 0) {
      this.currentTrack = this.tracks[this.currentItemIndex - 1]
    } else {
      this.currentTrack = this.tracks[this.tracks.length - 1]
    }

    this.audioService.setSource(this.currentTrack.id)
  }

  toggleRepeat(): void {
    switch (this.repeat) {
      case REPEAT_OPTIONS.None:
        this.repeat = REPEAT_OPTIONS.All
        break
      case REPEAT_OPTIONS.All:
        this.repeat = REPEAT_OPTIONS.Single
        break
      case REPEAT_OPTIONS.Single:
      default:
        this.repeat = REPEAT_OPTIONS.None
        break
    }
  }

  toggleShuffle(): void {
    this.shuffle = !this.shuffle

    if (!this.queue) {
      return
    }

    if (this.shuffle) {
      this.tracks = shuffleArray(this.tracks)
    } else {
      this.tracks = [...this.queue.tracks]
    }
  }

  addToPlayNext(tracks: Track[]): void {
    if (!this.queue) {
      return
    }

    const targetPosition = this.currentItemIndex + 1
    this.tracks.splice(targetPosition, 0, ...tracks)

    const originalTargetPosition = this.queue.tracks.findIndex((track) => track.id === this.currentTrack?.id) + 1
    this.queue.tracks.splice(originalTargetPosition, 0, ...tracks)
  }

  addToPlayLater(tracks: Track[]): void {
    if (!this.queue) {
      return
    }

    this.tracks.push(...tracks)
    this.queue.tracks.push(...tracks)
  }

  removeFromQueue(trackId: string): void {
    if (!this.queue) {
      return
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === trackId)
    this.tracks.splice(trackIndex, 1)

    const originalTrackIndex = this.queue.tracks.findIndex((track) => track.id === trackId)
    this.queue.tracks.splice(originalTrackIndex, 1)
  }

  moveTrack(trackId: string, targetPosition: number): void {
    if (!this.queue) {
      return
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === trackId)
    const [track] = this.tracks.splice(trackIndex, 1)

    this.tracks.splice(targetPosition, 0, track)

    const originalTrackIndex = this.queue.tracks.findIndex((t) => t.id === trackId)
    this.queue.tracks.splice(originalTrackIndex, 1)
    this.queue.tracks.splice(targetPosition, 0, track)
  }
}

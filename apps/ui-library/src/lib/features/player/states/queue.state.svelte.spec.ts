import { QueueState, type Queue } from './queue.state.svelte'

import type { Track } from '@/shared/models'
import { REPEAT_OPTIONS } from '@/features/playback/enums'

describe('QueueState', () => {
  let queueState: QueueState
  const mockTracks = [
    { id: '1', title: 'Track 1' },
    { id: '2', title: 'Track 2' },
    { id: '3', title: 'Track 3' },
  ] as Track[]

  const mockQueue: Queue = {
    id: '1',
    name: 'Test Queue',
    type: 'playlist',
    tracks: mockTracks,
  }

  beforeEach(() => {
    queueState = new QueueState()
    queueState.queue = mockQueue
    queueState.tracks = [...mockTracks]
  })

  describe('next()', () => {
    it('should move to next track', () => {
      queueState.currentTrack = mockTracks[0]
      queueState.next()
      expect(queueState.currentTrack).toEqual(mockTracks[1])
    })

    it('should move to first track when reaching end with repeat all', () => {
      queueState.repeat = REPEAT_OPTIONS.All
      queueState.currentTrack = mockTracks[2]
      queueState.next()
      expect(queueState.currentTrack).toEqual(mockTracks[0])
    })

    it('should not move past last track without repeat', () => {
      queueState.repeat = REPEAT_OPTIONS.None
      queueState.currentTrack = mockTracks[2]
      queueState.next()
      expect(queueState.currentTrack).toEqual(mockTracks[2])
    })
  })

  describe('previous()', () => {
    it('should move to previous track', () => {
      queueState.currentTrack = mockTracks[1]
      queueState.previous()
      expect(queueState.currentTrack).toEqual(mockTracks[0])
    })

    it('should move to last track when at start with repeat all', () => {
      queueState.repeat = REPEAT_OPTIONS.All
      queueState.currentTrack = mockTracks[0]
      queueState.previous()
      expect(queueState.currentTrack).toEqual(mockTracks[2])
    })

    it('should not move if there is no previous track', () => {
      queueState.repeat = REPEAT_OPTIONS.None
      queueState.currentTrack = mockTracks[0]
      queueState.previous()
      expect(queueState.currentTrack).toEqual(mockTracks[0])
    })
  })

  describe('toggleRepeat()', () => {
    it('should cycle through repeat modes', () => {
      expect(queueState.repeat).toBe(REPEAT_OPTIONS.None)

      queueState.toggleRepeat()
      expect(queueState.repeat).toBe(REPEAT_OPTIONS.All)

      queueState.toggleRepeat()
      expect(queueState.repeat).toBe(REPEAT_OPTIONS.Single)

      queueState.toggleRepeat()
      expect(queueState.repeat).toBe(REPEAT_OPTIONS.None)
    })
  })

  describe('hasNext', () => {
    it('should return true if there is a next track', () => {
      queueState.currentTrack = mockTracks[0]
      expect(queueState.hasNext).toBe(true)
    })

    it('should return false if there is no next track', () => {
      queueState.currentTrack = mockTracks[2]
      expect(queueState.hasNext).toBe(false)
    })

    it('should return true if there is a next track and repeat is all', () => {
      queueState.repeat = REPEAT_OPTIONS.All
      queueState.currentTrack = mockTracks[2]
      expect(queueState.hasNext).toBe(true)
    })
  })

  describe('hasPrevious', () => {
    it('should return true if there is a previous track', () => {
      queueState.currentTrack = mockTracks[1]
      expect(queueState.hasPrevious).toBe(true)
    })

    it('should return false if there is no previous track', () => {
      queueState.currentTrack = mockTracks[0]
      expect(queueState.hasPrevious).toBe(false)
    })

    it('should return true if there is a previous track and repeat is all', () => {
      queueState.repeat = REPEAT_OPTIONS.All
      queueState.currentTrack = mockTracks[0]
      expect(queueState.hasPrevious).toBe(true)
    })
  })

  describe('nextInQueue', () => {
    it('should return list of tracks after current track', () => {
      queueState.currentTrack = mockTracks[0]
      expect(queueState.nextInQueue).toEqual([mockTracks[1], mockTracks[2]])
    })

    it('should return empty list if there is no next track', () => {
      queueState.currentTrack = mockTracks[2]
      expect(queueState.nextInQueue).toEqual([])
    })

    it('should return empty list if there is no next track and repeat is all', () => {
      queueState.repeat = REPEAT_OPTIONS.All
      queueState.currentTrack = mockTracks[2]
      expect(queueState.nextInQueue).toEqual([])
    })
  })
})

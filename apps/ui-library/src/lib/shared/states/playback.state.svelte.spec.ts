import { PlaybackState } from './playback.state.svelte'

import { PLAYBACK_STATUS, REPEAT_OPTIONS } from '../enums'
import type { Queue, Track } from '../models'
import type { AudioService } from '../services'

describe('PlaybackState', () => {
  let audioServiceMock: Partial<AudioService>
  let state: PlaybackState
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
    audioServiceMock = {
      play: vi.fn(),
      pause: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
      setMute: vi.fn(),
      setSource: vi.fn(),
    }

    state = new PlaybackState(audioServiceMock as AudioService)
    state.queue = mockQueue
    state.tracks = [...mockTracks]
  })

  describe('play()', () => {
    it('should set status to Playing and call audioService.play()', () => {
      state.play()
      expect(state.status).toBe(PLAYBACK_STATUS.Playing)
      expect(audioServiceMock.play).toHaveBeenCalled()
    })
  })

  describe('pause()', () => {
    it('should set status to Paused and call audioService.pause()', () => {
      state.pause()
      expect(state.status).toBe(PLAYBACK_STATUS.Paused)
      expect(audioServiceMock.pause).toHaveBeenCalled()
    })
  })

  describe('togglePlay()', () => {
    it('should pause when currently playing the same track', () => {
      state.currentTrack = mockTracks[0]
      state.status = PLAYBACK_STATUS.Playing

      state.togglePlay(mockQueue, mockTracks[0].id)

      expect(state.status).toBe(PLAYBACK_STATUS.Paused)
      expect(audioServiceMock.pause).toHaveBeenCalled()
    })

    it('should play when currently paused on the same track', () => {
      state.currentTrack = mockTracks[0]
      state.status = PLAYBACK_STATUS.Paused

      state.togglePlay(mockQueue, mockTracks[0].id)

      expect(state.status).toBe(PLAYBACK_STATUS.Playing)
      expect(audioServiceMock.play).toHaveBeenCalled()
    })

    it('should start playing new track when different trackId provided', () => {
      state.currentTrack = mockTracks[0]

      state.togglePlay(mockQueue, mockTracks[1].id)

      expect(state.currentTrack).toEqual(mockTracks[1])
      expect(audioServiceMock.setSource).toHaveBeenCalledWith(mockTracks[1].id)
    })

    it('should set new queue when different queue provided', () => {
      const newQueue: Queue = {
        id: '2',
        name: 'New Queue',
        type: 'playlist',
        tracks: [mockTracks[1]],
      }

      state.togglePlay(newQueue)

      expect(state.queue).toEqual(newQueue)
      expect(state.tracks).toEqual(newQueue.tracks)
    })

    it('should start playing first track when new queue and no trackId provided', () => {
      state.queue = null
      state.tracks = []
      state.togglePlay(mockQueue)

      expect(state.currentTrack).toEqual(mockTracks[0])
      expect(audioServiceMock.setSource).toHaveBeenCalledWith(mockTracks[0].id)
    })

    it('should pause when playing the same queue and no trackId provided', () => {
      state.currentTrack = mockTracks[0]
      state.status = PLAYBACK_STATUS.Playing

      state.togglePlay(mockQueue)

      expect(state.status).toBe(PLAYBACK_STATUS.Paused)
      expect(audioServiceMock.pause).toHaveBeenCalled()
    })
  })

  describe('seek()', () => {
    it('should set currentTime and call audioService.seek()', () => {
      state.currentTrack = {
        duration: 100,
      } as Track

      const seekTime = 30

      state.seek(seekTime)

      expect(state.currentTime).toBe(seekTime)
      expect(audioServiceMock.seek).toHaveBeenCalledWith(seekTime)
    })

    it('should set currentTime to 0 if time is less than 0', () => {
      state.currentTrack = {
        duration: 100,
      } as Track

      state.seek(-10)

      expect(state.currentTime).toBe(0)
    })

    it('should set currentTime to duration if time is greater than duration', () => {
      state.currentTrack = {
        duration: 100,
      } as Track

      state.seek(110)

      expect(state.currentTime).toBe(100)
    })
  })

  describe('setVolume()', () => {
    it('should set volume and call audioService.setVolume()', () => {
      const volume = 75

      state.setVolume(volume)

      expect(state.volume).toBe(volume)
      expect(state.muted).toBe(false)
      expect(audioServiceMock.setVolume).toHaveBeenCalledWith(volume)
    })

    it('should set muted to true when volume is 0', () => {
      state.setVolume(0)

      expect(state.volume).toBe(0)
      expect(state.muted).toBe(true)
      expect(audioServiceMock.setVolume).toHaveBeenCalledWith(0)
    })
  })

  describe('toggleMute()', () => {
    it('should toggle mute state and call audioService.setMute()', () => {
      const initialMuted = state.muted

      state.toggleMute()

      expect(state.muted).toBe(!initialMuted)
      expect(audioServiceMock.setMute).toHaveBeenCalledWith(!initialMuted)
    })

    it('should set muted to true when volume is 0', () => {
      state.volume = 0
      state.muted = false

      state.toggleMute()

      expect(state.muted).toBe(true)
      expect(audioServiceMock.setMute).toHaveBeenCalledWith(true)
    })
  })

  describe('toggleShuffle()', () => {
    it('should toggle shuffle state', () => {
      const initialShuffle = state.shuffle

      state.toggleShuffle()

      expect(state.shuffle).toBe(!initialShuffle)
    })

    it('should shuffle tracks when enabling shuffle', () => {
      state.shuffle = false

      // Mock shuffleArray to return a predictable result
      vi.doMock('../utils', () => ({
        shuffleArray: vi.fn().mockReturnValue([mockTracks[2], mockTracks[0], mockTracks[1]]),
      }))

      state.toggleShuffle()

      expect(state.shuffle).toBe(true)
    })

    it('should restore original order when disabling shuffle', () => {
      state.shuffle = true
      state.tracks = [mockTracks[2], mockTracks[0], mockTracks[1]]

      state.toggleShuffle()

      expect(state.shuffle).toBe(false)
      expect(state.tracks).toEqual(mockTracks)
    })

    it('should not change tracks when no queue is set', () => {
      state.queue = null
      const originalTracks = [...state.tracks]

      state.toggleShuffle()

      expect(state.tracks).toEqual(originalTracks)
    })
  })

  describe('addToPlayNext()', () => {
    it('should add tracks after current track', () => {
      const newTracks = [{ id: '4', title: 'Track 4' }] as Track[]
      state.currentTrack = mockTracks[0]

      state.addToPlayNext(newTracks)

      expect(state.tracks[1]).toEqual(newTracks[0])
      expect(state.queue!.tracks[1]).toEqual(newTracks[0])
    })

    it('should not add tracks when no queue is set', () => {
      state.queue = null
      const newTracks = [{ id: '4', title: 'Track 4' }] as Track[]
      const originalTracksLength = state.tracks.length

      state.addToPlayNext(newTracks)

      expect(state.tracks).toHaveLength(originalTracksLength)
    })
  })

  describe('addToPlayLater()', () => {
    it('should add tracks to end of queue', () => {
      const newTracks = [{ id: '4', title: 'Track 4' }] as Track[]
      const originalLength = state.tracks.length

      state.addToPlayLater(newTracks)

      expect(state.tracks).toHaveLength(originalLength + 1)
      expect(state.tracks[originalLength]).toEqual(newTracks[0])
      expect(state.queue!.tracks[originalLength]).toEqual(newTracks[0])
    })

    it('should not add tracks when no queue is set', () => {
      state.queue = null
      const newTracks = [{ id: '4', title: 'Track 4' }] as Track[]
      const originalTracksLength = state.tracks.length

      state.addToPlayLater(newTracks)

      expect(state.tracks).toHaveLength(originalTracksLength)
    })
  })

  describe('removeFromQueue()', () => {
    it('should remove track from queue', () => {
      const trackToRemove = mockTracks[1]
      const originalLength = state.tracks.length

      state.removeFromQueue(trackToRemove.id)

      expect(state.tracks).toHaveLength(originalLength - 1)
      expect(state.tracks.find((t) => t.id === trackToRemove.id)).toBeUndefined()
      expect(state.queue!.tracks.find((t) => t.id === trackToRemove.id)).toBeUndefined()
    })

    it('should not remove track when no queue is set', () => {
      state.queue = null
      const originalTracksLength = state.tracks.length

      state.removeFromQueue(mockTracks[0].id)

      expect(state.tracks).toHaveLength(originalTracksLength)
    })
  })

  describe('moveTrack()', () => {
    it('should move track to target position', () => {
      const trackToMove = mockTracks[0]
      const targetPosition = 2

      state.moveTrack(trackToMove.id, targetPosition)

      expect(state.tracks[targetPosition]).toEqual(trackToMove)
      expect(state.queue!.tracks[targetPosition]).toEqual(trackToMove)
    })

    it('should not move track when no queue is set', () => {
      state.queue = null
      const originalTracks = [...state.tracks]

      state.moveTrack(mockTracks[0].id, 2)

      expect(state.tracks).toEqual(originalTracks)
    })
  })

  describe('next()', () => {
    it('should move to next track', () => {
      state.currentTrack = mockTracks[0]
      state.next()
      expect(state.currentTrack).toEqual(mockTracks[1])
    })

    it('should move to first track when reaching end with repeat all', () => {
      state.repeat = REPEAT_OPTIONS.All
      state.currentTrack = mockTracks[2]
      state.next()
      expect(state.currentTrack).toEqual(mockTracks[0])
    })

    it('should not move past last track without repeat', () => {
      state.repeat = REPEAT_OPTIONS.None
      state.currentTrack = mockTracks[2]
      state.next()
      expect(state.currentTrack).toEqual(mockTracks[2])
    })
  })

  describe('previous()', () => {
    it('should move to previous track', () => {
      state.currentTrack = mockTracks[1]
      state.previous()
      expect(state.currentTrack).toEqual(mockTracks[0])
    })

    it('should move to last track when at start with repeat all', () => {
      state.repeat = REPEAT_OPTIONS.All
      state.currentTrack = mockTracks[0]
      state.previous()
      expect(state.currentTrack).toEqual(mockTracks[2])
    })

    it('should not move if there is no previous track', () => {
      state.repeat = REPEAT_OPTIONS.None
      state.currentTrack = mockTracks[0]
      state.previous()
      expect(state.currentTrack).toEqual(mockTracks[0])
    })
  })

  describe('toggleRepeat()', () => {
    it('should cycle through repeat modes', () => {
      expect(state.repeat).toBe(REPEAT_OPTIONS.None)

      state.toggleRepeat()
      expect(state.repeat).toBe(REPEAT_OPTIONS.All)

      state.toggleRepeat()
      expect(state.repeat).toBe(REPEAT_OPTIONS.Single)

      state.toggleRepeat()
      expect(state.repeat).toBe(REPEAT_OPTIONS.None)
    })
  })

  describe('hasNext', () => {
    it('should return true if there is a next track', () => {
      state.currentTrack = mockTracks[0]
      expect(state.hasNext).toBe(true)
    })

    it('should return false if there is no next track', () => {
      state.currentTrack = mockTracks[2]
      expect(state.hasNext).toBe(false)
    })

    it('should return true if there is a next track and repeat is all', () => {
      state.repeat = REPEAT_OPTIONS.All
      state.currentTrack = mockTracks[2]
      expect(state.hasNext).toBe(true)
    })
  })

  describe('hasPrevious', () => {
    it('should return true if there is a previous track', () => {
      state.currentTrack = mockTracks[1]
      expect(state.hasPrevious).toBe(true)
    })

    it('should return false if there is no previous track', () => {
      state.currentTrack = mockTracks[0]
      expect(state.hasPrevious).toBe(false)
    })

    it('should return true if there is a previous track and repeat is all', () => {
      state.repeat = REPEAT_OPTIONS.All
      state.currentTrack = mockTracks[0]
      expect(state.hasPrevious).toBe(true)
    })
  })

  describe('nextInQueue', () => {
    it('should return list of tracks after current track', () => {
      state.currentTrack = mockTracks[0]
      expect(state.nextInQueue).toEqual([mockTracks[1], mockTracks[2]])
    })

    it('should return empty list if there is no next track', () => {
      state.currentTrack = mockTracks[2]
      expect(state.nextInQueue).toEqual([])
    })

    it('should return empty list if there is no next track and repeat is all', () => {
      state.repeat = REPEAT_OPTIONS.All
      state.currentTrack = mockTracks[2]
      expect(state.nextInQueue).toEqual([])
    })
  })
})

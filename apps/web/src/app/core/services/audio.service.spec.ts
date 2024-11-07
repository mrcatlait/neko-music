import { TestBed } from '@angular/core/testing'
import { Injector } from '@angular/core'
import { PartiallyMocked } from 'vitest'
import { MediaPlayerClass, PlaybackTimeUpdatedEvent } from 'dashjs'

import { AudioEvents, AudioService } from './audio.service'

import { AudioState, PlaybackState } from '@core/state'
import { environment } from '@environment'
import { API_URL } from '@core/tokens'

const mediaPlayerMock: PartiallyMocked<MediaPlayerClass> = {
  initialize: vi.fn(),
  isPaused: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  attachSource: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  seek: vi.fn(),
  isMuted: vi.fn(),
  setMute: vi.fn(),
  getVolume: vi.fn(),
  setVolume: vi.fn(),
  destroy: vi.fn(),
  setXHRWithCredentialsForType: vi.fn(),
}

vi.mock('dashjs', () => {
  const create = vi.fn().mockImplementation(() => mediaPlayerMock)
  const MediaPlayer = vi.fn().mockImplementation(() => ({ create }))

  return { MediaPlayer }
})

describe('AudioService', () => {
  let audioService: AudioService
  let injector: Injector
  let audioElementMock: Partial<HTMLAudioElement>

  beforeEach(() => {
    audioElementMock = {
      remove: vi.fn(() => Promise.resolve()),
    }

    vi.stubGlobal(
      'Audio',
      vi.fn().mockImplementation(() => audioElementMock),
    )

    TestBed.configureTestingModule({
      providers: [AudioService, Injector, { provide: API_URL, useValue: environment.apiUrl }],
    })

    audioService = TestBed.inject(AudioService)
    injector = TestBed.inject(Injector)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('play', () => {
    it('should not play audio when player is not paused', () => {
      // Arrange
      mediaPlayerMock.isPaused?.mockImplementation(() => false)

      // Act
      audioService.play()

      // Assert
      expect(mediaPlayerMock.play).not.toHaveBeenCalled()
    })

    it('should play audio when player is paused', () => {
      // Arrange
      mediaPlayerMock.isPaused?.mockImplementation(() => true)

      // Act
      audioService.play()

      // Assert
      expect(mediaPlayerMock.play).toHaveBeenCalled()
    })
  })

  describe('pause', () => {
    it('should pause audio when player is not paused', () => {
      // Arrange
      mediaPlayerMock.isPaused?.mockImplementation(() => false)

      // Act
      audioService.pause()

      // Assert
      expect(mediaPlayerMock.pause).toHaveBeenCalled()
    })

    it('should not pause audio when player is paused', () => {
      // Arrange
      mediaPlayerMock.isPaused?.mockImplementation(() => true)

      // Act
      audioService.pause()

      // Assert
      expect(mediaPlayerMock.pause).not.toHaveBeenCalled()
    })
  })

  describe('seek', () => {
    it('should seek to specified time', () => {
      // Arrange
      const currentTime = 30

      // Act
      audioService.seek(currentTime)

      // Assert
      expect(mediaPlayerMock.seek).toHaveBeenCalledWith(currentTime)
    })
  })

  describe('setVolume', () => {
    it('should set volume', () => {
      // Arrange
      mediaPlayerMock.isMuted?.mockImplementation(() => false)
      const volume = 50

      // Act
      audioService.setVolume(volume)

      // Assert
      expect(mediaPlayerMock.setVolume).toHaveBeenCalledWith(volume / 100)
    })

    it('should set volume to 0 and mute when volume is 0', () => {
      // Arrange
      mediaPlayerMock.isMuted?.mockReturnValue(false)

      // Act
      audioService.setVolume(0)

      // Assert
      expect(mediaPlayerMock.setMute).toHaveBeenCalledWith(true)
      expect(mediaPlayerMock.setVolume).toHaveBeenCalledWith(0)
    })

    it('should unmute when setting non-zero volume while muted', () => {
      // Arrange
      mediaPlayerMock.isMuted?.mockReturnValue(true)

      // Act
      audioService.setVolume(50)

      // Assert
      expect(mediaPlayerMock.setMute).toHaveBeenCalledWith(false)
      expect(mediaPlayerMock.setVolume).toHaveBeenCalledWith(0.5)
    })
  })

  describe('toggleMute', () => {
    it('should toggle mute', () => {
      // Arrange
      let muted = false
      mediaPlayerMock.setMute?.mockImplementation((value) => (muted = value))
      mediaPlayerMock.isMuted?.mockImplementation(() => muted)

      // Act
      audioService.toggleMute()

      // Assert
      expect(muted).toBe(true)

      // Act
      audioService.toggleMute()

      // Assert
      expect(muted).toBe(false)
    })
  })

  describe('load', () => {
    it('should load audio', () => {
      // Arrange
      const trackId = '123'

      // Act
      audioService.load(trackId)

      // Assert
      expect(mediaPlayerMock.attachSource).toHaveBeenCalledWith(
        `${environment.apiUrl}/tracks/${trackId}/stream/manifest.mpd`,
      )
    })
  })

  describe('onCanPlay', () => {
    it('should dispatch audio play action on player ready', () => {
      // Arrange
      const playSpy = vi.fn()
      const injectorSpy = vi.spyOn(injector, 'get').mockReturnValue({ play: playSpy })

      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(audioService as any).onCanPlay()

      // Assert
      expect(injectorSpy).toHaveBeenCalledWith(AudioState)
      expect(playSpy).toHaveBeenCalledOnce()
    })
  })

  describe('onPlaybackTimeUpdate', () => {
    it('should update audio state time on playback time update', () => {
      // Arrange
      const setTimeSpy = vi.fn()
      const injectorSpy = vi.spyOn(injector, 'get').mockReturnValue({ setTime: setTimeSpy })
      const event = { time: 10.5 } as PlaybackTimeUpdatedEvent

      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(audioService as any).onPlaybackTimeUpdate(event)

      // Assert
      expect(injectorSpy).toHaveBeenCalledWith(AudioState)
      expect(setTimeSpy).toHaveBeenCalledWith({ time: 10 })
    })

    it('should handle playback time update with undefined time', () => {
      // Arrange
      const setTimeSpy = vi.fn()
      const injectorSpy = vi.spyOn(injector, 'get').mockReturnValue({ setTime: setTimeSpy })
      const event = { time: undefined } as unknown as PlaybackTimeUpdatedEvent

      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(audioService as any).onPlaybackTimeUpdate(event)

      // Assert
      expect(injectorSpy).toHaveBeenCalledWith(AudioState)
      expect(setTimeSpy).toHaveBeenCalledWith({ time: 0 })
    })
  })

  describe('onPlaybackEnded', () => {
    it('should dispatch playback ended action on audio ended', () => {
      // Arrange
      const endedSpy = vi.fn()
      const injectorSpy = vi.spyOn(injector, 'get').mockReturnValue({ ended: endedSpy })

      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(audioService as any).onPlaybackEnded()

      // Assert
      expect(injectorSpy).toHaveBeenCalledWith(PlaybackState)
      expect(endedSpy).toHaveBeenCalledOnce()
    })
  })

  describe('registerEvents', () => {
    it('should register events on player', () => {
      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(audioService as any).registerEvents()

      // Assert
      expect(mediaPlayerMock.on).toHaveBeenCalledWith(AudioEvents.CAN_PLAY, expect.any(Function))
      expect(mediaPlayerMock.on).toHaveBeenCalledWith(AudioEvents.PLAYBACK_TIME_UPDATED, expect.any(Function))
      expect(mediaPlayerMock.on).toHaveBeenCalledWith(AudioEvents.PLAYBACK_ENDED, expect.any(Function))
    })
  })

  describe('removeEvents', () => {
    it('should remove events from player', () => {
      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(audioService as any).removeEvents()

      // Assert
      expect(mediaPlayerMock.off).toHaveBeenCalledWith(AudioEvents.CAN_PLAY, expect.any(Function))
      expect(mediaPlayerMock.off).toHaveBeenCalledWith(AudioEvents.PLAYBACK_TIME_UPDATED, expect.any(Function))
      expect(mediaPlayerMock.off).toHaveBeenCalledWith(AudioEvents.PLAYBACK_ENDED, expect.any(Function))
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AudioService } from './audio.service'
import type { MediaPlayerClass } from 'dashjs'
import type { PartiallyMocked } from 'vitest'

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

vi.mock('@/shared/decorators', () => ({
  BrowserOnly: (target: unknown) => target,
}))

describe('AudioService', () => {
  let audioService: AudioService
  let mockOptions: {
    onPlaybackTimeUpdate: ReturnType<typeof vi.fn>
    onCanPlay: ReturnType<typeof vi.fn>
    onPlaybackEnded: ReturnType<typeof vi.fn>
  }

  beforeEach(async () => {
    vi.stubGlobal('Audio', vi.fn())

    mockOptions = {
      onPlaybackTimeUpdate: vi.fn(),
      onCanPlay: vi.fn(),
      onPlaybackEnded: vi.fn(),
    }

    audioService = new AudioService(mockOptions)

    // Wait for the import to resolve
    await new Promise((resolve) => setTimeout(resolve, 10))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('play()', () => {
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

  describe('pause()', () => {
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

  describe('seek()', () => {
    it('should seek to specified time', () => {
      // Arrange
      const currentTime = 30

      // Act
      audioService.seek(currentTime)

      // Assert
      expect(mediaPlayerMock.seek).toHaveBeenCalledWith(currentTime)
    })
  })

  describe('setVolume()', () => {
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

  describe('setMute()', () => {
    it('should toggle mute', () => {
      // Arrange
      let muted = false
      mediaPlayerMock.setMute?.mockImplementation((value) => (muted = value))
      mediaPlayerMock.isMuted?.mockImplementation(() => muted)

      // Act
      audioService.setMute(true)

      // Assert
      expect(muted).toBe(true)

      // Act
      audioService.setMute(false)

      // Assert
      expect(muted).toBe(false)
    })
  })

  describe('setSource()', () => {
    it('should load audio', () => {
      // Arrange
      const trackId = '123'

      // Act
      audioService.setSource(trackId)

      // Assert
      expect(mediaPlayerMock.attachSource).toHaveBeenCalledWith(trackId)
    })
  })
})

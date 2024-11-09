import { NotFoundException, StreamableFile } from '@nestjs/common'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Test } from '@nestjs/testing'

import { TrackStreamingService } from './track-streaming.service'

import { STREAM_PATH } from '@common/constants'

vi.mock('fs', () => ({
  createReadStream: vi.fn(),
  existsSync: vi.fn(),
}))

vi.mock('path', () => ({
  join: vi.fn(),
}))

describe('TrackStreamingService', () => {
  let service: TrackStreamingService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TrackStreamingService],
    }).compile()

    service = module.get(TrackStreamingService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('streamManifest', () => {
    it('should return a StreamableFile when manifest exists', () => {
      // Arrange
      const trackId = '123'
      const filePath = '/path/to/manifest.mpd'
      const mockStream = {} as ReturnType<typeof createReadStream>

      vi.mocked(join).mockReturnValue(filePath)
      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(createReadStream).mockReturnValue(mockStream)

      // Act
      const result = service.streamManifest(trackId)

      // Assert
      expect(result).toBeInstanceOf(StreamableFile)
      expect(join).toHaveBeenCalledWith(STREAM_PATH, 'tracks', trackId, 'manifest.mpd')
      expect(createReadStream).toHaveBeenCalledWith(filePath)
    })

    it('should throw NotFoundException when manifest does not exist', () => {
      // Arrange
      const trackId = '123'

      vi.mocked(existsSync).mockReturnValue(false)

      // Act & Assert
      expect(() => service.streamManifest(trackId)).toThrow(NotFoundException)
    })
  })

  describe('streamSegment', () => {
    it('should return StreamableFile when segment exists', () => {
      // Arrange
      const trackId = 'track-123'
      const segmentId = 'segment-456'
      const mockPath = '/mock/path'
      const mockStream = {} as ReturnType<typeof createReadStream>

      vi.mocked(join).mockReturnValue(mockPath)
      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(createReadStream).mockReturnValue(mockStream)

      // Act
      const result = service.streamSegment(trackId, segmentId)

      // Assert
      expect(join).toHaveBeenCalledWith(STREAM_PATH, 'tracks', trackId, segmentId)
      expect(existsSync).toHaveBeenCalledWith(mockPath)
      expect(createReadStream).toHaveBeenCalledWith(mockPath)
      expect(result).toBeInstanceOf(StreamableFile)
    })

    it('should throw NotFoundException when segment does not exist', () => {
      // Arrange
      const trackId = 'track-123'
      const segmentId = 'segment-456'
      const mockPath = '/mock/path'

      vi.mocked(join).mockReturnValue(mockPath)
      vi.mocked(existsSync).mockReturnValue(false)

      // Act & Assert
      expect(() => service.streamSegment(trackId, segmentId)).toThrow(NotFoundException)
      expect(join).toHaveBeenCalledWith(STREAM_PATH, 'tracks', trackId, segmentId)
      expect(existsSync).toHaveBeenCalledWith(mockPath)
      expect(createReadStream).not.toHaveBeenCalled()
    })
  })
})

/* eslint-disable @typescript-eslint/no-floating-promises */
import { NotFoundError } from 'elysia'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { StreamingService } from './streaming.service'
import { STREAM_PATH } from '../constants'

import { Container } from '@common/di'

describe('StreamingService', () => {
  let service: StreamingService
  const existsSync = mock()
  const join = mock()
  const file = mock()

  mock.module('bun', () => ({ file }))
  mock.module('fs', () => ({ existsSync }))
  mock.module('path', () => ({ join }))

  beforeEach(() => {
    service = Container.get(StreamingService)
  })

  describe('streamManifest', () => {
    it('should return a ReadableStream when manifest exists', () => {
      // Arrange
      const trackId = '123'
      const filePath = '/path/to/manifest.mpd'
      const mockStream = {} as ReadableStream<Uint8Array>

      join.mockReturnValue(filePath)
      existsSync.mockReturnValue(true)
      file.mockReturnValue(mockStream)

      // Act
      const result = service.streamManifest(trackId)

      // Assert
      expect(join).toHaveBeenCalledWith(STREAM_PATH, 'tracks', trackId, 'manifest.mpd')
      expect(existsSync).toHaveBeenCalledWith(filePath)
      expect(result).toBeInstanceOf(ReadableStream)
    })

    it('should throw NotFoundError when manifest does not exist', () => {
      // Arrange
      const trackId = '123'

      existsSync.mockReturnValue(false)

      // Act & Assert
      expect(() => service.streamManifest(trackId)).toThrow(NotFoundError)
      expect(join).toHaveBeenCalledWith(STREAM_PATH, 'tracks', trackId, 'manifest.mpd')
      expect(file).not.toHaveBeenCalled()
    })
  })

  describe('streamSegment', () => {
    it('should return ReadableStream when segment exists', () => {
      // Arrange
      const trackId = 'track-123'
      const segmentId = 'segment-456'
      const mockPath = '/mock/path'
      const mockStream = {} as ReadableStream<Uint8Array>

      join.mockReturnValue(mockPath)
      existsSync.mockReturnValue(true)
      file.mockReturnValue(mockStream)

      // Act
      const result = service.streamSegment(trackId, segmentId)

      // Assert
      expect(join).toHaveBeenCalledWith(STREAM_PATH, 'tracks', trackId, segmentId)
      expect(existsSync).toHaveBeenCalledWith(mockPath)
      expect(result).toBeInstanceOf(ReadableStream)
    })

    it('should throw NotFoundError when segment does not exist', () => {
      // Arrange
      const trackId = 'track-123'
      const segmentId = 'segment-456'
      const mockPath = '/mock/path'

      join.mockReturnValue(mockPath)
      existsSync.mockReturnValue(false)

      // Act & Assert
      expect(() => service.streamSegment(trackId, segmentId)).toThrow(NotFoundError)
      expect(join).toHaveBeenCalledWith(STREAM_PATH, 'tracks', trackId, segmentId)
      expect(existsSync).toHaveBeenCalledWith(mockPath)
      expect(file).not.toHaveBeenCalled()
    })
  })
})

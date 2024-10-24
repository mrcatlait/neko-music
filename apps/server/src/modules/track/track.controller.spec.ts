import { Test } from '@nestjs/testing'
import { StreamableFile } from '@nestjs/common'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { TrackController } from './track.controller'
import { TrackService } from './track.service'
import { TracksPageOptionsDto, TracksPageDto } from './dto'

describe('TrackController', () => {
  let controller: TrackController
  let mockTrackService: Partial<TrackService>

  beforeEach(async () => {
    mockTrackService = {
      getTracks: vi.fn(),
      getPopularTracks: vi.fn(),
      getNewTracks: vi.fn(),
      stream: vi.fn(),
    }

    const module = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [
        {
          provide: TrackService,
          useValue: mockTrackService,
        },
      ],
    }).compile()

    controller = module.get<TrackController>(TrackController)
  })

  describe('tracks', () => {
    it('should return tracks page', async () => {
      // Arrange
      const pageOptionsDto: TracksPageOptionsDto = { offset: 0, take: 10 }
      const expectedResult: TracksPageDto = {
        data: [],
        meta: { offset: 0, take: 10, itemCount: 0, pageCount: 0 },
      }
      mockTrackService.getTracks = vi.fn().mockResolvedValue(expectedResult)

      // Act
      const result = await controller.tracks(pageOptionsDto)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockTrackService.getTracks).toHaveBeenCalledWith(pageOptionsDto)
    })
  })

  describe('popularTracks', () => {
    it('should return popular tracks page', async () => {
      // Arrange
      const pageOptionsDto: TracksPageOptionsDto = { offset: 0, take: 10 }
      const expectedResult: TracksPageDto = {
        data: [],
        meta: { offset: 0, take: 10, itemCount: 0, pageCount: 0 },
      }
      mockTrackService.getPopularTracks = vi.fn().mockResolvedValue(expectedResult)

      // Act
      const result = await controller.popularTracks(pageOptionsDto)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockTrackService.getPopularTracks).toHaveBeenCalledWith(pageOptionsDto)
    })
  })

  describe('newTracks', () => {
    it('should return new tracks page', async () => {
      // Arrange
      const pageOptionsDto: TracksPageOptionsDto = { offset: 0, take: 10 }
      const expectedResult: TracksPageDto = {
        data: [],
        meta: { offset: 0, take: 10, itemCount: 0, pageCount: 0 },
      }
      mockTrackService.getNewTracks = vi.fn().mockResolvedValue(expectedResult)

      // Act
      const result = await controller.newTracks(pageOptionsDto)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockTrackService.getNewTracks).toHaveBeenCalledWith(pageOptionsDto)
    })
  })

  describe('stream', () => {
    it('should return a StreamableFile', () => {
      // Arrange
      const trackId = '123'
      const filename = 'track.mp3'
      const expectedResult = new StreamableFile(Buffer.from(''))
      mockTrackService.stream = vi.fn().mockReturnValue(expectedResult)

      // Act
      const result = controller.stream(trackId, filename)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockTrackService.stream).toHaveBeenCalledWith(trackId, filename)
    })
  })
})

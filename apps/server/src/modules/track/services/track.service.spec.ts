import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotFoundException, StreamableFile } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

import { TrackService } from './track.service'
import { TrackEntity } from '../entities'
import { TracksPageOptionsDto } from '../dto'

import { ArtistService } from '@modules/artist/services'

vi.mock('fs')
vi.mock('path')

describe('TrackService', () => {
  let trackService: TrackService
  let trackRepositoryMock: PartiallyMocked<Repository<TrackEntity>>
  let artistServiceMock: PartiallyMocked<ArtistService>

  beforeEach(async () => {
    trackRepositoryMock = {
      findOne: vi.fn(),
      findAndCount: vi.fn(),
    }

    artistServiceMock = {
      exists: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: getRepositoryToken(TrackEntity),
          useValue: trackRepositoryMock,
        },
        {
          provide: ArtistService,
          useValue: artistServiceMock,
        },
      ],
    }).compile()

    trackService = module.get(TrackService)
  })

  describe('getTrackById', () => {
    it('should return a track when found', async () => {
      // Arrange
      const mockTrack = new TrackEntity()
      mockTrack.id = '1'
      mockTrack.title = 'Test Track'
      mockTrack.toDto = vi.fn().mockReturnValue({ id: '1', title: 'Test Track' })
      trackRepositoryMock.findOne?.mockResolvedValue(mockTrack)

      // Act
      const result = await trackService.getTrackById('1')

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe('1')
      expect(result.title).toBe('Test Track')
    })

    it('should throw NotFoundException when track is not found', async () => {
      // Arrange
      trackRepositoryMock.findOne?.mockResolvedValue(null)

      // Act & Assert
      await expect(trackService.getTrackById('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('getTracks', () => {
    it('should return a page of tracks', async () => {
      // Arrange
      const mockTracks = [new TrackEntity(), new TrackEntity()]
      mockTracks.forEach((track) => {
        track.toDto = vi.fn().mockReturnValue({})
      })
      const mockCount = 2
      trackRepositoryMock.findAndCount?.mockResolvedValue([mockTracks, mockCount])
      const pageOptionsDto = new TracksPageOptionsDto()

      // Act
      const result = await trackService.getTracks(pageOptionsDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.data).toHaveLength(2)
      expect(result.meta).toBeDefined()
      expect(result.meta.itemCount).toBe(2)
    })
  })

  describe('getArtistTracks', () => {
    it('should return a page of artist tracks when artist exists', async () => {
      // Arrange
      artistServiceMock.exists?.mockResolvedValue(true)
      const mockTracks = [new TrackEntity(), new TrackEntity()]
      mockTracks.forEach((track) => {
        track.toDto = vi.fn().mockReturnValue({})
      })
      const mockCount = 2
      trackRepositoryMock.findAndCount?.mockResolvedValue([mockTracks, mockCount])
      const pageOptionsDto = new TracksPageOptionsDto()

      // Act
      const result = await trackService.getArtistTracks('artistId', pageOptionsDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.data).toHaveLength(2)
      expect(result.meta).toBeDefined()
      expect(result.meta.itemCount).toBe(2)
    })

    it('should throw NotFoundException when artist does not exist', async () => {
      // Arrange
      artistServiceMock.exists?.mockResolvedValue(false)
      const pageOptionsDto = new TracksPageOptionsDto()

      // Act & Assert
      await expect(trackService.getArtistTracks('artistId', pageOptionsDto)).rejects.toThrow(NotFoundException)
    })
  })

  describe('getPopularTracks', () => {
    it('should return a page of popular tracks', async () => {
      // Arrange
      const mockTracks = [new TrackEntity(), new TrackEntity()]
      mockTracks.forEach((track) => {
        track.toDto = vi.fn().mockReturnValue({})
      })
      const mockCount = 2
      trackRepositoryMock.findAndCount?.mockResolvedValue([mockTracks, mockCount])
      const pageOptionsDto = new TracksPageOptionsDto()

      // Act
      const result = await trackService.getPopularTracks(pageOptionsDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.data).toHaveLength(2)
      expect(result.meta).toBeDefined()
      expect(result.meta.itemCount).toBe(2)
    })
  })

  describe('getNewTracks', () => {
    it('should return a page of new tracks', async () => {
      // Arrange
      const mockTracks = [new TrackEntity(), new TrackEntity()]
      mockTracks.forEach((track) => {
        track.toDto = vi.fn().mockReturnValue({})
      })
      const mockCount = 2
      trackRepositoryMock.findAndCount?.mockResolvedValue([mockTracks, mockCount])
      const pageOptionsDto = new TracksPageOptionsDto()

      // Act
      const result = await trackService.getNewTracks(pageOptionsDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.data).toHaveLength(2)
      expect(result.meta).toBeDefined()
      expect(result.meta.itemCount).toBe(2)
    })
  })

  describe('stream', () => {
    it('should return a StreamableFile when file exists', () => {
      // Arrange
      const mockFilePath = '/path/to/file'
      vi.spyOn(path, 'join').mockReturnValue(mockFilePath)
      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'createReadStream').mockReturnValue({} as fs.ReadStream)

      // Act
      const result = trackService.stream('trackId', 'filename')

      // Assert
      expect(result).toBeInstanceOf(StreamableFile)
    })

    it('should throw NotFoundException when file does not exist', () => {
      // Arrange
      const mockFilePath = '/path/to/file'
      vi.spyOn(path, 'join').mockReturnValue(mockFilePath)
      vi.spyOn(fs, 'existsSync').mockReturnValue(false)

      // Act & Assert
      expect(() => trackService.stream('trackId', 'filename')).toThrow(NotFoundException)
    })
  })
})

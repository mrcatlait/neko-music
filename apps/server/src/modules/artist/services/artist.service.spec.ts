import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotFoundException } from '@nestjs/common'

import { ArtistService } from './artist.service'
import { ArtistEntity } from '../entities'
import { ArtistsPageOptionsDto } from '../dto'

describe('ArtistService', () => {
  let artistService: ArtistService
  let artistRepositoryMock: PartiallyMocked<Repository<ArtistEntity>>

  beforeEach(async () => {
    artistRepositoryMock = {
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      existsBy: vi.fn(),
      findAndCount: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: getRepositoryToken(ArtistEntity),
          useValue: artistRepositoryMock,
        },
      ],
    }).compile()

    artistService = module.get(ArtistService)
  })

  describe('getArtist', () => {
    it('should return an artist when found', async () => {
      // Arrange
      const mockArtist = new ArtistEntity()
      mockArtist.id = '1'
      mockArtist.name = 'Test Artist'
      artistRepositoryMock.findOne?.mockResolvedValue(mockArtist)

      // Act
      const result = await artistService.getArtist('1')

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe('1')
      expect(result.name).toBe('Test Artist')
    })

    it('should throw NotFoundException when artist is not found', async () => {
      // Arrange
      artistRepositoryMock.findOne?.mockResolvedValue(null)

      // Act & Assert
      await expect(artistService.getArtist('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('findOneById', () => {
    it('should return an artist when found', async () => {
      // Arrange
      const mockArtist = new ArtistEntity()
      mockArtist.id = '1'
      artistRepositoryMock.findOneBy?.mockResolvedValue(mockArtist)

      // Act
      const result = await artistService.findOneById('1')

      // Assert
      expect(result).toBeDefined()
      expect(result?.id).toBe('1')
    })

    it('should return null when artist is not found', async () => {
      // Arrange
      artistRepositoryMock.findOneBy?.mockResolvedValue(null)

      // Act
      const result = await artistService.findOneById('1')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('exists', () => {
    it('should return true when artist exists', async () => {
      // Arrange
      artistRepositoryMock.existsBy?.mockResolvedValue(true)

      // Act
      const result = await artistService.exists('1')

      // Assert
      expect(result).toBe(true)
    })

    it('should return false when artist does not exist', async () => {
      // Arrange
      artistRepositoryMock.existsBy?.mockResolvedValue(false)

      // Act
      const result = await artistService.exists('1')

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getArtists', () => {
    it('should return a page of artists', async () => {
      // Arrange
      const mockArtists = [new ArtistEntity(), new ArtistEntity()]
      const mockCount = 2
      artistRepositoryMock.findAndCount?.mockResolvedValue([mockArtists, mockCount])
      const pageOptionsDto = new ArtistsPageOptionsDto()

      // Act
      const result = await artistService.getArtists(pageOptionsDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.data).toHaveLength(2)
      expect(result.meta).toBeDefined()
      expect(result.meta.itemCount).toBe(2)
    })
  })
})

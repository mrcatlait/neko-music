import { Test, TestingModule } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'

import { ArtistsController } from './artist.controller'
import { ArtistService } from './services'
import { ArtistDto } from './dto'

import { TrackService } from '@modules/track/track.service'
import { TracksPageDto, TracksPageOptionsDto } from '@modules/track/dto'

describe('ArtistsController', () => {
  let controller: ArtistsController
  let artistServiceMock: PartiallyMocked<ArtistService>
  let trackServiceMock: PartiallyMocked<TrackService>

  beforeEach(async () => {
    artistServiceMock = {
      getArtist: vi.fn(),
    }
    trackServiceMock = {
      getArtistTracks: vi.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistService,
          useValue: artistServiceMock,
        },
        {
          provide: TrackService,
          useValue: trackServiceMock,
        },
      ],
    }).compile()

    controller = module.get<ArtistsController>(ArtistsController)
  })

  describe('artistById', () => {
    it('should return an artist by id', async () => {
      // Arrange
      const artistId = '123'
      const expectedArtist: ArtistDto = { id: artistId, name: 'Test Artist' }
      artistServiceMock.getArtist?.mockResolvedValue(expectedArtist)

      // Act
      const result = await controller.artistById({ artistId })

      // Assert
      expect(result).toEqual(expectedArtist)
      expect(artistServiceMock.getArtist).toHaveBeenCalledWith(artistId)
    })
  })

  describe('tracksByArtistId', () => {
    it('should return tracks by artist id', async () => {
      // Arrange
      const artistId = '123'
      const pageOptions: TracksPageOptionsDto = { offset: 0, take: 10 }
      const expectedTracks: TracksPageDto = {
        data: [{ id: '1', title: 'Test Track', duration: 0, artists: [], images: [] }],
        meta: { offset: 0, take: 10, itemCount: 1, pageCount: 1 },
      }
      trackServiceMock.getArtistTracks?.mockResolvedValue(expectedTracks)

      // Act
      const result = await controller.tracksByArtistId({ artistId }, pageOptions)

      // Assert
      expect(result).toEqual(expectedTracks)
      expect(trackServiceMock.getArtistTracks).toHaveBeenCalledWith(artistId, pageOptions)
    })
  })
})

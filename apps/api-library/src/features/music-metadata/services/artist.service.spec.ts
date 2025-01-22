import { PartiallyMocked } from 'vitest'

import { ArtistService } from './artist.service'
import { ArtistRepository } from '../repositories'

describe('ArtistService', () => {
  let mockArtistRepository: PartiallyMocked<ArtistRepository>
  let service: ArtistService

  beforeEach(() => {
    mockArtistRepository = {
      getById: vi.fn().mockResolvedValue('hi'),
    }

    service = new ArtistService(mockArtistRepository as unknown as ArtistRepository)
  })

  describe('getById', () => {
    it('should return artist by id', async () => {
      // Arrange
      const expectedId = '1'

      // Act
      const response = await service.getById(expectedId)

      // Assert
      expect(response).toBe('hi1')
    })
  })
})

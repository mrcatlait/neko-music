import type { PartiallyMocked } from 'vitest'

import { ArtistRepository } from '@/modules/backstage/repositories'

export const artistRepositoryMock: PartiallyMocked<ArtistRepository> = {
  createArtistWithGenres: vi.fn(),
  findArtistById: vi.fn(),
  findArtistByName: vi.fn(),
  findArtistByNameExcluding: vi.fn(),
  findArtistWithGenresById: vi.fn(),
  findArtistsByIds: vi.fn(),
  getArtistStatistics: vi.fn(),
  update: vi.fn(),
  updateArtistWithGenres: vi.fn(),
}

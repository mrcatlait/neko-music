import type { PartiallyMocked } from 'vitest'

import { ArtistRepository } from '@/modules/backstage/repositories'

export const artistRepositoryMock: PartiallyMocked<ArtistRepository> = {
  createWithGenres: vi.fn(),
  findOne: vi.fn(),
  findMany: vi.fn(),
  update: vi.fn(),
  updateWithGenres: vi.fn(),
  exists: vi.fn(),
  count: vi.fn(),
  getArtistStatistics: vi.fn(),
  findOneWithGenres: vi.fn(),
}

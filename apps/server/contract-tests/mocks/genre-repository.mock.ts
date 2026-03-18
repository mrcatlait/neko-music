import type { PartiallyMocked } from 'vitest'

import { GenreRepository } from '@/modules/backstage/repositories'

export const genreRepositoryMock: PartiallyMocked<GenreRepository> = {
  createGenre: vi.fn(),
  findAllGenres: vi.fn(),
  findGenreById: vi.fn(),
  findGenreByName: vi.fn(),
  findGenresByIds: vi.fn(),
  getGenreStatistics: vi.fn(),
  updateGenre: vi.fn(),
}

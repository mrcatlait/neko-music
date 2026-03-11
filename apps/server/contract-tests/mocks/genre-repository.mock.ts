import type { PartiallyMocked } from 'vitest'

import { GenreRepository } from '@/modules/backstage/repositories'

export const genreRepositoryMock: PartiallyMocked<GenreRepository> = {
  getGenreStatistics: vi.fn(),
}

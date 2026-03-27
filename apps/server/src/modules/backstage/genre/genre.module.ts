import { Module } from '@nestjs/common'

import { GenreMutation } from './mutations'
import { GenreQuery } from './queries'
import { GenreRepository } from './repositories'
import {
  CreateGenreUseCase,
  CreateGenreValidator,
  GetGenreUseCase,
  GetGenresUseCase,
  UpdateGenreUseCase,
  UpdateGenreValidator,
} from './use-cases'

@Module({
  imports: [],
  providers: [
    // Mutations
    GenreMutation,
    // Queries
    GenreQuery,
    // Repositories
    GenreRepository,
    // Use cases
    CreateGenreUseCase,
    CreateGenreValidator,
    GetGenreUseCase,
    GetGenresUseCase,
    UpdateGenreUseCase,
    UpdateGenreValidator,
  ],
  exports: [GenreRepository],
})
export class BackstageGenreModule {}

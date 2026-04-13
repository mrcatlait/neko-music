import { Module } from '@nestjs/common'

import { GenreMutation } from './mutations'
import { GenreQuery } from './queries'
import { GenreRepository } from './repositories'
import {
  CreateBackstageGenreUseCase,
  CreateBackstageGenreValidator,
  GetBackstageGenreUseCase,
  GetBackstageGenresUseCase,
  UpdateBackstageGenreUseCase,
  UpdateBackstageGenreValidator,
  ProcessBackstageGenreLifecycleUseCase,
  SyncPublishedGenreUseCase,
  SyncPublishedGenreValidator,
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
    CreateBackstageGenreUseCase,
    CreateBackstageGenreValidator,
    GetBackstageGenreUseCase,
    GetBackstageGenresUseCase,
    UpdateBackstageGenreUseCase,
    UpdateBackstageGenreValidator,
    ProcessBackstageGenreLifecycleUseCase,
    SyncPublishedGenreUseCase,
    SyncPublishedGenreValidator,
  ],
  exports: [GenreRepository],
})
export class BackstageGenreModule {}

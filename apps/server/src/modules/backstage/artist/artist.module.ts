import { Module } from '@nestjs/common'

import { ArtistListener } from './listeners/artist.listener'
import { ArtistMutation } from './mutations/artist.mutation'
import { ArtistQuery } from './queries/artist.query'
import { ArtistRepository } from './repositories/artist.repository'
import {
  CreateBackstageArtistUseCase,
  CreateBackstageArtistValidator,
  GenerateArtistArtworkUploadTokenUseCase,
  GenerateArtistArtworkUploadTokenValidator,
  GetBackstageArtistsUseCase,
  GetBackstageArtistUseCase,
  SyncArtistUseCase,
  SyncArtistValidator,
  UpdateBackstageArtistArtworkUseCase,
  UpdateBackstageArtistArtworkValidator,
  UpdateBackstageArtistUseCase,
  UpdateBackstageArtistValidator,
} from './use-cases'
import { BackstageGenreModule } from '../genre/genre.module'
import { ArtistLoader } from './loaders'

@Module({
  imports: [BackstageGenreModule],
  providers: [
    ArtistListener,
    ArtistLoader,
    ArtistMutation,
    ArtistQuery,
    ArtistRepository,
    CreateBackstageArtistUseCase,
    CreateBackstageArtistValidator,
    GetBackstageArtistUseCase,
    GetBackstageArtistsUseCase,
    GenerateArtistArtworkUploadTokenUseCase,
    GenerateArtistArtworkUploadTokenValidator,
    UpdateBackstageArtistUseCase,
    UpdateBackstageArtistValidator,
    UpdateBackstageArtistArtworkUseCase,
    UpdateBackstageArtistArtworkValidator,
    SyncArtistUseCase,
    SyncArtistValidator,
  ],
  exports: [ArtistLoader],
})
export class BackstageArtistModule {}

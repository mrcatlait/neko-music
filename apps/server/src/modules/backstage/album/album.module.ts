import { Module } from '@nestjs/common'

import { AlbumListener } from './listeners'
import { AlbumMutation } from './mutations'
import { AlbumQuery } from './queries'
import { AlbumRepository } from './repositories'
import {
  CreateBackstageAlbumUseCase,
  CreateBackstageAlbumValidator,
  GenerateAlbumArtworkUploadTokenUseCase,
  GenerateAlbumArtworkUploadTokenValidator,
  GetBackstageAlbumsUseCase,
  GetBackstageAlbumUseCase,
  ProcessBackstageAlbumLifecycleUseCase,
  ProcessLinkedBackstageTracksUseCase,
  SyncPublishedAlbumUseCase,
  SyncPublishedAlbumValidator,
  UpdateBackstageAlbumArtworkUseCase,
  UpdateBackstageAlbumArtworkValidator,
  UpdateBackstageAlbumUseCase,
  UpdateBackstageAlbumValidator,
} from './use-cases'

@Module({
  imports: [],
  providers: [
    // Listeners
    AlbumListener,
    // Loaders
    // AlbumLoader,
    // Mutations
    AlbumMutation,
    // Queries
    AlbumQuery,
    // Repositories
    AlbumRepository,
    // Use cases
    CreateBackstageAlbumUseCase,
    CreateBackstageAlbumValidator,
    GenerateAlbumArtworkUploadTokenUseCase,
    GenerateAlbumArtworkUploadTokenValidator,
    GetBackstageAlbumUseCase,
    GetBackstageAlbumsUseCase,
    ProcessBackstageAlbumLifecycleUseCase,
    ProcessLinkedBackstageTracksUseCase,
    SyncPublishedAlbumUseCase,
    SyncPublishedAlbumValidator,
    UpdateBackstageAlbumUseCase,
    UpdateBackstageAlbumValidator,
    UpdateBackstageAlbumArtworkUseCase,
    UpdateBackstageAlbumArtworkValidator,
  ],
  exports: [AlbumRepository, ProcessBackstageAlbumLifecycleUseCase],
})
export class BackstageAlbumModule {}

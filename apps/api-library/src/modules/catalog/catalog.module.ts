import { Global, Module } from '@nestjs/common'

import { AlbumController, ArtistController, GenreController, TrackController } from './controllers'
import {
  GenreRepository,
  AlbumRepository,
  ArtistRepository,
  TrackRepository,
  AlbumArtistRepository,
  AlbumGenreRepository,
  ArtistGenreRepository,
  TrackGenreRepository,
  TrackArtistRepository,
} from './repositories'
import {
  CreateAlbumUseCase,
  CreateAlbumValidator,
  CreateArtistUseCase,
  CreateArtistValidator,
  CreateGenreUseCase,
  CreateGenreValidator,
  CreateTrackUseCase,
  CreateTrackValidator,
  GetArtistArtworkUploadTokenUseCase,
  GetArtistArtworkUploadTokenValidator,
  GetArtistUseCase,
  GetTracksForAlbumUseCase,
  UpdateArtistStatusUseCase,
  UpdateArtistStatusValidator,
  UpdateArtistUseCase,
  UpdateArtistValidator,
  UpdateVerifiedStatusUseCase,
  UpdateVerifiedStatusValidator,
} from './use-cases'

@Global()
@Module({
  controllers: [AlbumController, ArtistController, GenreController, TrackController],
  providers: [
    // Use cases
    CreateAlbumUseCase,
    CreateAlbumValidator,
    CreateArtistUseCase,
    CreateArtistValidator,
    CreateGenreUseCase,
    CreateGenreValidator,
    CreateTrackUseCase,
    CreateTrackValidator,
    GetArtistUseCase,
    GetArtistArtworkUploadTokenUseCase,
    GetArtistArtworkUploadTokenValidator,
    GetTracksForAlbumUseCase,
    UpdateArtistUseCase,
    UpdateArtistValidator,
    UpdateArtistStatusUseCase,
    UpdateArtistStatusValidator,
    UpdateVerifiedStatusUseCase,
    UpdateVerifiedStatusValidator,
    // Repositories
    AlbumArtistRepository,
    AlbumGenreRepository,
    AlbumRepository,
    ArtistGenreRepository,
    ArtistRepository,
    GenreRepository,
    TrackArtistRepository,
    TrackGenreRepository,
    TrackRepository,
  ],
})
export class CatalogModule {}

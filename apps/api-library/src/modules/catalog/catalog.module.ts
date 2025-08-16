import { Global, Module } from '@nestjs/common'

import { AlbumsController, ArtistController, GenreController } from './controllers'
import {
  GenreRepository,
  AlbumRepository,
  ArtistRepository,
  TrackRepository,
  AlbumArtistRepository,
  AlbumGenreRepository,
  ArtistGenreRepository,
} from './repositories'
import {
  CreateAlbumUseCase,
  CreateAlbumValidator,
  CreateArtistUseCase,
  CreateArtistValidator,
  CreateGenreUseCase,
  CreateGenreValidator,
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
  controllers: [AlbumsController, ArtistController, GenreController],
  providers: [
    // Use cases
    CreateAlbumUseCase,
    CreateAlbumValidator,
    CreateArtistUseCase,
    CreateArtistValidator,
    CreateGenreUseCase,
    CreateGenreValidator,
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
    TrackRepository,
  ],
})
export class CatalogModule {}

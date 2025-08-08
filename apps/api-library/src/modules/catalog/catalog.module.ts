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
  GetArtistUseCase,
  GetPopularAlbumsUseCase,
  GetTracksForAlbumUseCase,
} from './use-cases'
import { ArtworkEvent } from './events/artwork.event'

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
    GetPopularAlbumsUseCase,
    GetTracksForAlbumUseCase,
    // Repositories
    AlbumArtistRepository,
    AlbumGenreRepository,
    AlbumRepository,
    ArtistGenreRepository,
    ArtistRepository,
    GenreRepository,
    TrackRepository,
    // Events
    ArtworkEvent,
  ],
})
export class CatalogModule {}

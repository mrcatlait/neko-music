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
import { GetArtistUseCase, GetTracksForAlbumUseCase } from './use-cases'

@Global()
@Module({
  controllers: [AlbumController, ArtistController, GenreController, TrackController],
  providers: [
    // Use cases
    GetArtistUseCase,
    GetTracksForAlbumUseCase,
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

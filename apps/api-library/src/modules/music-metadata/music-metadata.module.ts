import { Global, Module } from '@nestjs/common'

import { AlbumsController } from './controllers'
import { GetArtistHandler, GetGenresHandler, GetPopularAlbumsHandler } from './queries'
import { GenreRepository, AlbumRepository, ArtistRepository, TrackRepository } from './repositories'

@Global()
@Module({
  controllers: [AlbumsController],
  providers: [
    // Commands
    // Queries
    GetArtistHandler,
    GetGenresHandler,
    GetPopularAlbumsHandler,
    // Repositories
    AlbumRepository,
    ArtistRepository,
    GenreRepository,
    TrackRepository,
  ],
})
export class MusicMetadataModule {}

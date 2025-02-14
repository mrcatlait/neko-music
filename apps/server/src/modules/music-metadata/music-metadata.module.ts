import { Global, Module } from '@nestjs/common'

import { ArtistRepository, TrackArtistRepository, TrackRepository } from './repositories'
import { GetArtistHandler, GetArtistTracksHandler, GetNewTracksHandler, GetPopularTracksHandler } from './queries'
import { ArtistController, TrackController } from './controllers'
import { CreateArtistHandler } from './commands'

@Global()
@Module({
  controllers: [ArtistController, TrackController],
  providers: [
    // Handlers
    GetArtistHandler,
    GetArtistTracksHandler,
    GetNewTracksHandler,
    GetPopularTracksHandler,
    CreateArtistHandler,
    // Repositories
    ArtistRepository,
    TrackRepository,
    TrackArtistRepository,
  ],
})
export class MusicMetadataModule {}

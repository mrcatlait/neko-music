import { Global, Module } from '@nestjs/common'

import { TrackArtistRepository, TrackRepository } from './repositories'
import { GetNewTracksHandler, GetPopularTracksHandler } from './queries'
import { TrackController } from './controllers'
import { TrackStreamingService } from './services'

@Global()
@Module({
  controllers: [TrackController],
  providers: [
    GetNewTracksHandler,
    GetPopularTracksHandler,
    TrackRepository,
    TrackArtistRepository,
    TrackStreamingService,
  ],
  exports: [TrackRepository, TrackArtistRepository],
})
export class TrackModule {}

import { Module } from '@nestjs/common'

import { ArtistController } from './controllers'
import { GetArtistHandler, GetArtistTracksHandler } from './queries'
import { ArtistRepository } from './repositories'

@Module({
  controllers: [ArtistController],
  providers: [ArtistRepository, GetArtistHandler, GetArtistTracksHandler],
})
export class ArtistModule {}

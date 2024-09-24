import { Module } from '@nestjs/common'

import { ArtistModule } from './artist'
import { PlaylistModule } from './playlist'
import { TrackModule } from './track'

@Module({
  imports: [ArtistModule, PlaylistModule, TrackModule],
})
export class FeaturesModule {}

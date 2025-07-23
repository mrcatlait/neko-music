import { Module } from '@nestjs/common'

import { ArtistArtworkUploadStrategy } from './artist-artwork.strategy'
import { UploadStrategyRegistry } from './upload.strategy-registry'

@Module({
  providers: [ArtistArtworkUploadStrategy, UploadStrategyRegistry],
  exports: [UploadStrategyRegistry],
})
export class UploadStrategyModule {}

import { Injectable } from '@nestjs/common'

import { UploadStrategy } from './upload.strategy'
import { ArtistArtworkUploadStrategy } from './artist-artwork.strategy'

export type UploadStrategyName = 'artist-artwork'

@Injectable()
export class UploadStrategyRegistry {
  private readonly strategies = new Map<UploadStrategyName, UploadStrategy>()

  constructor(private readonly artistArtworkUploadStrategy: ArtistArtworkUploadStrategy) {
    this.strategies.set('artist-artwork', this.artistArtworkUploadStrategy)
  }

  getStrategy(strategyName: UploadStrategyName): UploadStrategy {
    const strategy = this.strategies.get(strategyName)

    if (!strategy) {
      throw new Error(`Upload strategy not found for name: ${strategyName}`)
    }

    return strategy
  }
}

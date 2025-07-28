import { Injectable } from '@nestjs/common'

import { ProcessingStrategy } from './processing.strategy'
import { ArtistArtworkProcessingStrategy } from './artist-artwork-processing.strategy'

export type ProcessingStrategyName = 'artist-artwork'

@Injectable()
export class ProcessingStrategyRegistry {
  private readonly strategies = new Map<ProcessingStrategyName, ProcessingStrategy>()

  constructor(private readonly artistArtworkProcessingStrategy: ArtistArtworkProcessingStrategy) {
    this.strategies.set('artist-artwork', this.artistArtworkProcessingStrategy)
  }

  getStrategy(strategyName: ProcessingStrategyName): ProcessingStrategy {
    const strategy = this.strategies.get(strategyName)

    if (!strategy) {
      throw new Error(`Processing strategy not found for name: ${strategyName}`)
    }

    return strategy
  }
}

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { StorageProvider } from '../../enums'
import { LocalStorageStrategy } from './local-storage.strategy'
import { MediaStorageStrategy } from './storage.strategy'

@Injectable()
export class StorageStrategyRegistry {
  private readonly defaultProvider: StorageProvider
  private readonly strategies = new Map<StorageProvider, MediaStorageStrategy>()

  constructor(
    private readonly configService: ConfigService,
    private readonly localStorageStrategy: LocalStorageStrategy,
  ) {
    /**
     * @todo Get default provider from config
     */
    this.defaultProvider = StorageProvider.LOCAL
    this.strategies.set(StorageProvider.LOCAL, this.localStorageStrategy)
  }

  getStrategy(provider?: StorageProvider): MediaStorageStrategy {
    const strategy = this.strategies.get(provider ?? this.defaultProvider)

    if (!strategy) {
      throw new Error(`Storage strategy not found for provider: ${provider}`)
    }

    return strategy
  }
}

import { Module } from '@nestjs/common'

import { LocalStorageStrategy } from './local-storage.strategy'
import { StorageStrategyRegistry } from './storage.strategy-registry'

@Module({
  providers: [LocalStorageStrategy, StorageStrategyRegistry],
  exports: [StorageStrategyRegistry],
})
export class StorageStrategyModule {}

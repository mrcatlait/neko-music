import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { ImportStrategy } from './import.strategy'
import { IMPORT_MODULE_OPTIONS } from '../tokens'
import { ImportModuleOptions } from '../module-options'

@Injectable()
export class ImportStrategyFactory {
  private readonly importStrategyMap = new Map<string, ImportStrategy>()

  constructor(@Inject(IMPORT_MODULE_OPTIONS) private readonly options: ImportModuleOptions) {
    for (const strategy of options.importStrategies) {
      this.importStrategyMap.set(strategy.method.key, strategy)
    }
  }

  create(key: string): ImportStrategy {
    const strategy = this.importStrategyMap.get(key)

    if (!strategy) {
      throw new NotFoundException(`Import strategy ${key} not found`)
    }

    return strategy
  }

  getMethods() {
    return Array.from(this.importStrategyMap.values()).map((strategy) => strategy.method)
  }
}

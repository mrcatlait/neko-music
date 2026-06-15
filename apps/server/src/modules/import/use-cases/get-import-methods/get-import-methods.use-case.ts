import { Injectable } from '@nestjs/common'

import { ImportStrategyFactory } from '../../strategies'
import { ImportMethod } from '../../models'

import { UseCase } from '@/modules/shared/types'

@Injectable()
export class GetImportMethodsUseCase implements UseCase<void, ImportMethod[]> {
  constructor(private readonly importStrategyFactory: ImportStrategyFactory) {}

  invoke(): Promise<ImportMethod[]> {
    return Promise.resolve(this.importStrategyFactory.getMethods())
  }
}

import { BadRequestException, Injectable } from '@nestjs/common'

import { ImportUseCaseParams } from './import.use-case'
import { ImportStrategyFactory } from '../../strategies/import-strategy.factory'
import { ImportJobRepository } from '../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class ImportValidator implements Validator<ImportUseCaseParams> {
  constructor(
    private readonly importStrategyFactory: ImportStrategyFactory,
    private readonly importJobRepository: ImportJobRepository,
  ) {}

  async validate(params: ImportUseCaseParams): Promise<void> {
    const strategy = this.importStrategyFactory.create(params.dataSource)
    const canonicalSourceRef = strategy.normalizeSourceRef(params.sourceRef)

    const jobExists = await this.importJobRepository.exists({
      dataSource: params.dataSource,
      sourceRef: canonicalSourceRef,
    })

    if (jobExists) {
      throw new BadRequestException('Import job already exists for this target')
    }

    const validInput = strategy.validateSourceRef(canonicalSourceRef)

    if (!validInput) {
      throw new BadRequestException('Invalid import target')
    }
  }
}

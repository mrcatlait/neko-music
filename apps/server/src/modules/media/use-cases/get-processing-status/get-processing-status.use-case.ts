import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { ProcessingJobRepository } from '../../repositories'
import { EntityType } from '../../enums'
import { ProcessingJobTable } from '../../media.schema'

import { UseCase } from '@/modules/shared/types'

export interface GetProcessingStatusUseCaseParams {
  entityType: EntityType
  entityId?: string
  entityIds?: string[]
}

export type GetProcessingStatusUseCaseResult = Selectable<ProcessingJobTable & { entityId: string }>[]

@Injectable()
export class GetProcessingStatusUseCase implements UseCase<
  GetProcessingStatusUseCaseParams,
  GetProcessingStatusUseCaseResult
> {
  constructor(private readonly processingJobRepository: ProcessingJobRepository) {}

  invoke(params: GetProcessingStatusUseCaseParams): Promise<GetProcessingStatusUseCaseResult> {
    return this.processingJobRepository.findManyByEntity(params)
  }
}

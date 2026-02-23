import { Injectable } from '@nestjs/common'

import { EntityType, ProcessingStatus } from '../../enums'
import { MediaRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/interfaces'

export interface GetMediaReadinessUseCaseParams {
  entityType: EntityType
  entityId: string
}

export interface GetMediaReadinessUseCaseResult {
  ready: boolean
}

@Injectable()
export class GetMediaReadinessUseCase implements UseCase<
  GetMediaReadinessUseCaseParams,
  GetMediaReadinessUseCaseResult
> {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async invoke(params: GetMediaReadinessUseCaseParams): Promise<GetMediaReadinessUseCaseResult> {
    const sourceAsset = await this.mediaRepository.findSourceAssetByEntityTypeAndEntityId(
      params.entityType,
      params.entityId,
    )

    if (!sourceAsset) {
      return {
        ready: false,
      }
    }

    const processingJob = await this.mediaRepository.findProcessingJobBySourceAssetId(sourceAsset.id)

    if (!processingJob) {
      return {
        ready: false,
      }
    }

    if (processingJob.status !== ProcessingStatus.COMPLETED) {
      return {
        ready: false,
      }
    }

    return {
      ready: true,
    }
  }
}

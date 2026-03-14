import { Injectable } from '@nestjs/common'

import { EntityType, ProcessingStatus } from '../../enums'
import { MediaRepository, SourceAssetRepository } from '../../repositories'

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
  constructor(
    private readonly sourceAssetRepository: SourceAssetRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async invoke(params: GetMediaReadinessUseCaseParams): Promise<GetMediaReadinessUseCaseResult> {
    const assets = await this.sourceAssetRepository.findAllByEntityTypeAndEntityId(params.entityType, params.entityId)

    if (assets.length === 0) {
      return {
        ready: false,
      }
    }

    const lastAsset = assets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]

    const processingJob = await this.mediaRepository.findProcessingJobBySourceAssetId(lastAsset.id)

    if (!processingJob) {
      return {
        ready: false,
      }
    }

    if (processingJob.status !== ProcessingStatus.Completed) {
      return {
        ready: false,
      }
    }

    return {
      ready: true,
    }
  }
}

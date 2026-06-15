import { Injectable, NotFoundException } from '@nestjs/common'

import { ImportStatus } from '../../enums'
import { ImportJobDetails } from '../../models'
import { ImportJobItemRepository, ImportJobRepository, MetadataClaimReviewRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

export interface GetImportJobUseCaseParams {
  id: string
}

@Injectable()
export class GetImportJobUseCase implements UseCase<GetImportJobUseCaseParams, ImportJobDetails> {
  constructor(
    private readonly importJobRepository: ImportJobRepository,
    private readonly importJobItemRepository: ImportJobItemRepository,
    private readonly metadataClaimReviewRepository: MetadataClaimReviewRepository,
  ) {}

  async invoke(params: GetImportJobUseCaseParams): Promise<ImportJobDetails> {
    const job = await this.importJobRepository.findOne(params.id)

    if (!job) {
      throw new NotFoundException('Import job not found')
    }

    const items = await this.importJobItemRepository.findMany({
      jobId: job.id,
    })
    const pendingReviewItems = await this.metadataClaimReviewRepository.countPendingByJobId(job.id)
    const totalItems = items.length
    const completedItems = items.filter((item) => item.status === ImportStatus.Completed).length
    const failedItems = items.filter((item) => item.status === ImportStatus.Failed).length
    const progressPercent = totalItems === 0 ? 0 : Math.round(((completedItems + failedItems) / totalItems) * 100)

    return {
      id: job.id,
      dataSource: job.dataSource,
      sourceRef: job.sourceRef,
      label: job.label,
      status: job.status,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      totalItems,
      completedItems,
      failedItems,
      pendingReviewItems,
      progressPercent,
      items: items.map((item) => ({
        id: item.id,
        sourceItemRef: item.sourceItemRef,
        label: item.label,
        status: item.status,
        retryCount: item.retryCount ?? 0,
        errorMessage: item.errorMessage,
      })),
    }
  }
}

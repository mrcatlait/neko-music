import { Injectable } from '@nestjs/common'

import { ImportStatus } from '../../enums'
import { ImportJobSummary } from '../../models'
import { ImportJobItemRepository, ImportJobRepository, MetadataClaimReviewRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

@Injectable()
export class GetImportJobsUseCase implements UseCase<void, ImportJobSummary[]> {
  constructor(
    private readonly importJobRepository: ImportJobRepository,
    private readonly importJobItemRepository: ImportJobItemRepository,
    private readonly metadataClaimReviewRepository: MetadataClaimReviewRepository,
  ) {}

  async invoke(): Promise<ImportJobSummary[]> {
    const jobs = await this.importJobRepository.findRecent()

    return Promise.all(
      jobs.map(async (job) => {
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
        }
      }),
    )
  }
}

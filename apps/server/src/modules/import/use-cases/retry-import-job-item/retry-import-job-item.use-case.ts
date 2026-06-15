import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { ImportStatus } from '../../enums'
import { ImportJobItemRepository, ImportJobItemRetryHistoryRepository, ImportJobRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

export interface RetryImportJobItemUseCaseParams {
  importJobItemId: string
  reason?: string
  userId: string
}

export interface RetryImportJobItemUseCaseResult {
  id: string
}

@Injectable()
export class RetryImportJobItemUseCase implements UseCase<RetryImportJobItemUseCaseParams, RetryImportJobItemUseCaseResult> {
  constructor(
    private readonly importJobItemRepository: ImportJobItemRepository,
    private readonly importJobItemRetryHistoryRepository: ImportJobItemRetryHistoryRepository,
    private readonly importJobRepository: ImportJobRepository,
  ) {}

  async invoke(params: RetryImportJobItemUseCaseParams): Promise<RetryImportJobItemUseCaseResult> {
    const item = await this.importJobItemRepository.findOne(params.importJobItemId)

    if (!item) {
      throw new NotFoundException('Import job item not found')
    }

    if (item.status !== ImportStatus.Failed) {
      throw new BadRequestException('Only failed import items can be retried')
    }

    const nextAttemptNumber = (item.retryCount ?? 0) + 1

    await this.importJobItemRetryHistoryRepository.create({
      importJobItemId: item.id,
      attemptNumber: nextAttemptNumber,
      reason: params.reason ?? null,
      errorMessage: item.errorMessage,
      createdBy: params.userId,
    })

    await this.importJobItemRepository.update(item.id, {
      status: ImportStatus.Pending,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      retryCount: nextAttemptNumber,
      lastRetriedAt: new Date(),
      lastRetriedBy: params.userId,
    })

    await this.importJobRepository.update(item.jobId, {
      status: ImportStatus.Pending,
      completedAt: null,
    })

    return {
      id: item.id,
    }
  }
}

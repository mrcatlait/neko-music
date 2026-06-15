import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { ImportStatus } from '../../enums'
import { ImportJobRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

export interface CancelImportJobUseCaseParams {
  jobId: string
}

export interface CancelImportJobUseCaseResult {
  id: string
}

@Injectable()
export class CancelImportJobUseCase
  implements UseCase<CancelImportJobUseCaseParams, CancelImportJobUseCaseResult>
{
  constructor(private readonly importJobRepository: ImportJobRepository) {}

  async invoke(params: CancelImportJobUseCaseParams): Promise<CancelImportJobUseCaseResult> {
    const job = await this.importJobRepository.findOne(params.jobId)

    if (!job) {
      throw new NotFoundException('Import job not found')
    }

    if ([ImportStatus.Completed, ImportStatus.Failed, ImportStatus.Canceled].includes(job.status)) {
      throw new BadRequestException('Import job is already finished')
    }

    if (job.status !== ImportStatus.CancelRequested) {
      await this.importJobRepository.update(params.jobId, {
        status: ImportStatus.CancelRequested,
      })
    }

    return {
      id: job.id,
    }
  }
}

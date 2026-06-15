import { Injectable, Logger } from '@nestjs/common'

import { ImportStrategyFactory } from '../strategies'
import { ImportJobItemRepository } from '../repositories'
import { ImportStatus } from '../enums'
import { MetadataClaimProcessorService } from './metadata-claim-processor.service'

interface JobItemContext {
  jobItemId: string
  sourceItemRef: string
  dataSource: string
  userId: string
}

@Injectable()
export class ImportJobItemRunnerService {
  private readonly logger = new Logger(ImportJobItemRunnerService.name)

  constructor(
    private readonly importStrategyFactory: ImportStrategyFactory,
    private readonly importJobItemRepository: ImportJobItemRepository,
    private readonly metadataClaimProcessorService: MetadataClaimProcessorService,
  ) {}

  async run(ctx: JobItemContext): Promise<void> {
    await this.importJobItemRepository.update(ctx.jobItemId, {
      status: ImportStatus.InProgress,
      startedAt: new Date(),
    })

    try {
      const importStrategy = this.importStrategyFactory.create(ctx.dataSource)

      this.logger.log(`Starting to ingest track ${ctx.sourceItemRef}`)

      const ingestResult = await importStrategy.ingestTrack(ctx.sourceItemRef)

      for (const claim of ingestResult.claims) {
        await this.metadataClaimProcessorService.process({
          importJobItemId: ctx.jobItemId,
          claim,
        })
      }

      this.logger.log(`Ingested track ${ctx.sourceItemRef}`)

      await this.importJobItemRepository.update(ctx.jobItemId, {
        status: ImportStatus.Completed,
        completedAt: new Date(),
        audioPath: ingestResult.assets.audioPath,
        artworkPath: ingestResult.assets.artworkPath,
      })
    } catch (error) {
      this.logger.error(error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const shortErrorMessage = errorMessage.length > 255 ? errorMessage.slice(0, 255) : errorMessage

      await this.importJobItemRepository.update(ctx.jobItemId, {
        status: ImportStatus.Failed,
        completedAt: new Date(),
        errorMessage: shortErrorMessage,
      })
    }
  }
}

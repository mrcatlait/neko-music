import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { ImportValidator } from './import.validator'
import { ImportStrategyFactory } from '../../strategies/import-strategy.factory'
import { ImportJobItemRepository, ImportJobRepository } from '../../repositories'
import { ImportStatus } from '../../enums'

import { UseCase } from '@/modules/shared/types'

export interface ImportUseCaseParams {
  dataSource: string
  sourceRef: string
  userId: string
}

export interface ImportUseCaseResult {
  id: string
}

@Injectable()
export class ImportUseCase implements UseCase<ImportUseCaseParams, ImportUseCaseResult> {
  private static readonly HARD_DUPLICATE_MESSAGE = 'hard_duplicate'

  constructor(
    private readonly importValidator: ImportValidator,
    private readonly importStrategyFactory: ImportStrategyFactory,
    private readonly importJobRepository: ImportJobRepository,
    private readonly importJobItemRepository: ImportJobItemRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async invoke(params: ImportUseCaseParams): Promise<ImportUseCaseResult> {
    await this.importValidator.validate(params)

    const importStrategy = this.importStrategyFactory.create(params.dataSource)
    const canonicalSourceRef = importStrategy.normalizeSourceRef(params.sourceRef)

    const discoverResult = await importStrategy.discoverTracks(canonicalSourceRef)
    const canonicalTracks = Array.from(
      discoverResult.tracks
        .map((track) => ({
          sourceItemRef: importStrategy.normalizeSourceItemRef(track.sourceItemRef),
          label: track.label,
        }))
        .reduce((map, track) => {
          if (!map.has(track.sourceItemRef)) {
            map.set(track.sourceItemRef, track)
          }

          return map
        }, new Map<string, { sourceItemRef: string; label: string | undefined }>())
        .values(),
    )

    const job = await this.importJobRepository.create({
      dataSource: params.dataSource,
      sourceRef: canonicalSourceRef,
      status: ImportStatus.Pending,
      label: discoverResult.label,
      createdBy: params.userId,
    })

    const existingCanonicalRefs = await this.importJobItemRepository.findExistingCanonicalRefs(
      params.dataSource,
      canonicalTracks.map((track) => track.sourceItemRef),
    )

    await this.importJobItemRepository.createMany(
      canonicalTracks.map((track) => ({
        jobId: job.id,
        status: existingCanonicalRefs.has(track.sourceItemRef) ? ImportStatus.Completed : ImportStatus.Pending,
        sourceItemRef: track.sourceItemRef,
        label: track.label || track.sourceItemRef,
        errorMessage: existingCanonicalRefs.has(track.sourceItemRef) ? ImportUseCase.HARD_DUPLICATE_MESSAGE : null,
      })),
    )

    // this.eventEmitter.emit(
    //   ImportJobCreatedEvent.event,
    //   new ImportJobCreatedEvent({
    //     jobId: job.id,
    //     source: params.source,
    //   }),
    // )

    return {
      id: job.id,
    }
  }
}

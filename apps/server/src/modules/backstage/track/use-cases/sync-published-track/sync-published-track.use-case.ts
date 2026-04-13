import { Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { SyncPublishedTrackValidator } from './sync-published-track.validator'
import { GetBackstageTrackUseCase } from '../get-backstage-track'

import { UseCase } from '@/modules/shared/types'

export interface SyncPublishedTrackUseCaseParams {
  readonly trackId: string
}

export type SyncPublishedTrackUseCaseResult = void

@Injectable()
export class SyncPublishedTrackUseCase implements UseCase<
  SyncPublishedTrackUseCaseParams,
  SyncPublishedTrackUseCaseResult
> {
  constructor(
    private readonly syncPublishedTrackValidator: SyncPublishedTrackValidator,
    private readonly trackRepository: TrackRepository,
    private readonly getBackstageTrackUseCase: GetBackstageTrackUseCase,
  ) {}

  async invoke(params: SyncPublishedTrackUseCaseParams): Promise<SyncPublishedTrackUseCaseResult> {
    await this.syncPublishedTrackValidator.validate(params)

    const track = await this.getBackstageTrackUseCase.invoke({ id: params.trackId })

    if (track.status !== PublishingStatus.Published) {
      await this.trackRepository.update(track.id, {
        status: PublishingStatus.Published,
      })
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { SyncPublishedTrackUseCaseParams } from './sync-published-track.use-case'

import { Validator } from '@/modules/shared/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class SyncPublishedTrackValidator implements Validator<SyncPublishedTrackUseCaseParams> {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
  ) {}

  async validate(params: SyncPublishedTrackUseCaseParams): Promise<void> {
    const track = await this.trackRepository.findOne(params.trackId)

    if (!track) {
      throw new BadRequestException(`Track ${params.trackId} not found`)
    }

    if (track.status !== PublishingStatus.Review && track.status !== PublishingStatus.Published) {
      throw new BadRequestException('Track is not ready for publishing')
    }

    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Track,
      entityId: params.trackId,
    })

    if (!mediaReadiness.ready) {
      throw new BadRequestException(`Media file for track ${params.trackId} is not ready`)
    }
  }
}

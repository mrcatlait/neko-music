import { BadRequestException, Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { UpdateBackstageTrackPlaybackUseCaseParams } from './update-backstage-track-playback.use-case'

import { Validator } from '@/modules/shared/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class UpdateBackstageTrackPlaybackValidator implements Validator<UpdateBackstageTrackPlaybackUseCaseParams> {
  constructor(
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
    private readonly trackRepository: TrackRepository,
  ) {}

  async validate(params: UpdateBackstageTrackPlaybackUseCaseParams): Promise<void> {
    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Track,
      entityId: params.id,
    })

    if (!mediaReadiness.ready) {
      throw new BadRequestException('Media file is not ready')
    }

    const track = await this.trackRepository.findOne(params.id)

    if (!track) {
      throw new BadRequestException('Track not found')
    }
  }
}

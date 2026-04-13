import { BadRequestException, Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { UpdateBackstageTrackArtworkUseCaseParams } from './update-backstage-track-artwork.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class UpdateBackstageTrackArtworkValidator implements Validator<UpdateBackstageTrackArtworkUseCaseParams> {
  constructor(private readonly trackRepository: TrackRepository) {}

  async validate(params: UpdateBackstageTrackArtworkUseCaseParams): Promise<void> {
    const track = await this.trackRepository.exists(params.id)

    if (!track) {
      throw new BadRequestException('Track not found')
    }
  }
}

import { Injectable } from '@nestjs/common'

import { UpdateArtistStatusValidator } from './update-artist-status.validator'
import { ArtistRepository } from '../../../repositories'

import { UseCase } from '@/modules/shared/types'
import { PublishingStatus } from '@/modules/backstage/enums'

export interface UpdateArtistStatusUseCaseParams {
  readonly artistId: string
  readonly status: PublishingStatus
}

@Injectable()
export class UpdateArtistStatusUseCase implements UseCase<UpdateArtistStatusUseCaseParams, void> {
  constructor(
    private readonly updateArtistStatusValidator: UpdateArtistStatusValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: UpdateArtistStatusUseCaseParams): Promise<void> {
    await this.updateArtistStatusValidator.validate(params)

    const artist = await this.artistRepository.findOne(params.artistId)

    if (artist!.status === PublishingStatus.Published) {
      return
    }

    await this.artistRepository.update(params.artistId, {
      status: params.status,
    })
  }
}

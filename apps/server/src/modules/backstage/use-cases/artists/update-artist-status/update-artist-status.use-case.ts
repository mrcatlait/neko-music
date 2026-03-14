import { Injectable } from '@nestjs/common'

import { UpdateArtistStatusValidator } from './update-artist-status.validator'
import { ArtistRepository } from '../../../repositories'

import { UseCase } from '@/modules/shared/interfaces'
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
    const validationResult = await this.updateArtistStatusValidator.validate(params)

    if (!validationResult.isValid) {
      throw new Error(validationResult.error)
    }

    await this.artistRepository.updateArtistStatus(params.artistId, params.status)
  }
}

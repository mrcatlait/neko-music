import { BadRequestException, Injectable } from '@nestjs/common'

import { PublishArtistValidator } from './publish-artist.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { ArtistRepository } from '@/modules/backstage/repositories'

export interface PublishArtistUseCaseParams {
  readonly artistId: string
}

export type PublishArtistUseCaseResult = void

@Injectable()
export class PublishArtistUseCase implements UseCase<PublishArtistUseCaseParams, PublishArtistUseCaseResult> {
  constructor(
    private readonly publishArtistValidator: PublishArtistValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: PublishArtistUseCaseParams): Promise<PublishArtistUseCaseResult> {
    const validationResult = await this.publishArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.artistRepository.publishArtist(params.artistId)
  }
}

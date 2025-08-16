import { BadRequestException, Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { ArtistEntity } from '../../entities'
import { UpdateVerifiedStatusValidator } from './update-verified-status.validator'

export interface UpdateVerifiedStatusUseCaseParams {
  readonly id: string
  readonly verified: boolean
}

@Injectable()
export class UpdateVerifiedStatusUseCase {
  constructor(
    private readonly updateVerifiedStatusValidator: UpdateVerifiedStatusValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: UpdateVerifiedStatusUseCaseParams): Promise<ArtistEntity> {
    const validationResult = await this.updateVerifiedStatusValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const artist = (await this.artistRepository.find(params.id))!
    artist.verified = params.verified
    return this.artistRepository.update(artist)
  }
}

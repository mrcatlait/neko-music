import { BadRequestException, Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { ArtistEntity } from '../../entities'
import { UpdateArtistStatusValidator } from './update-artist-status.validator'
import { RecordStatus } from '../../enums'

export interface UpdateArtistStatusUseCaseParams {
  readonly id: string
  readonly status: RecordStatus
}

/**
 * @todo Rename to ReviewArtistUseCase
 */
@Injectable()
export class UpdateArtistStatusUseCase {
  constructor(
    private readonly updateArtistStatusValidator: UpdateArtistStatusValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: UpdateArtistStatusUseCaseParams): Promise<ArtistEntity> {
    const validationResult = await this.updateArtistStatusValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const artist = (await this.artistRepository.find(params.id))!
    artist.status = params.status
    return this.artistRepository.update(artist)
  }
}

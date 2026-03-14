import { Injectable } from '@nestjs/common'

import { UpdateArtistStatusUseCaseParams } from './update-artist-status.use-case'
import { ArtistRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { PublishingStatus } from '@/modules/backstage/enums'

@Injectable()
export class UpdateArtistStatusValidator implements Validator<UpdateArtistStatusUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: UpdateArtistStatusUseCaseParams): Promise<ValidationResult> {
    const artist = await this.artistRepository.findArtistById(params.artistId)

    if (!artist) {
      return {
        isValid: false,
        error: `Artist ${params.artistId} not found'`,
      }
    }

    return { isValid: true }
  }
}

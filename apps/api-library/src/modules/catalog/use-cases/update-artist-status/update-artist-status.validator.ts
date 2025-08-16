import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { UpdateArtistStatusUseCaseParams } from './update-artist-status.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateArtistStatusValidator implements Validator<UpdateArtistStatusUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: UpdateArtistStatusUseCaseParams): Promise<ValidationResult> {
    const artistExists = await this.artistRepository.exists(params.id)

    if (!artistExists) {
      return {
        isValid: false,
        errors: ['Artist not found'],
      }
    }

    return {
      isValid: true,
    }
  }
}

import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { UpdateVerifiedStatusUseCaseParams } from './update-verified-status.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateVerifiedStatusValidator implements Validator<UpdateVerifiedStatusUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: UpdateVerifiedStatusUseCaseParams): Promise<ValidationResult> {
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

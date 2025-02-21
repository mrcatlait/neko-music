import { Injectable } from '@nestjs/common'

import { ValidationResult, Validator } from '@modules/shared/models'

import { CreateArtistCommand } from './create-artist.command'
import { ArtistRepository } from '../../repositories'

@Injectable()
export class CreateArtistValidator implements Validator<CreateArtistCommand> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(command: CreateArtistCommand): Promise<ValidationResult> {
    const artistExists = await this.artistRepository.getByName(command.name)

    const isValid = !artistExists

    return {
      isValid,
      errors: [],
    }
  }
}

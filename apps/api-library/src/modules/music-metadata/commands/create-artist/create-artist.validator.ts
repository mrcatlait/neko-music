import { Injectable } from '@nestjs/common'

import { CreateArtistCommand } from './create-artist.command'
import { ArtistRepository, GenreRepository } from '../../repositories'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class CreateArtistValidator implements Validator<CreateArtistCommand> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(command: CreateArtistCommand): Promise<ValidationResult> {
    const artistExists = await this.artistRepository.exists(command.name)

    if (artistExists) {
      return {
        isValid: false,
        errors: ['Artist already exists'],
      }
    }

    const genresExist = await this.genreRepository.existsAll(command.genres)

    if (!genresExist) {
      return {
        isValid: false,
        errors: ['Genres not found'],
      }
    }

    return {
      isValid: true,
    }
  }
}

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
    const artistExists = await this.artistRepository.findOneByName(command.name)

    if (artistExists) {
      return {
        isValid: false,
        errors: ['Artist already exists'],
      }
    }

    const genres = await this.genreRepository.findAll()

    if (command.genres.some((genre) => !genres.some((g) => g.id === genre))) {
      return {
        isValid: false,
        errors: ['Genre not found'],
      }
    }

    return {
      isValid: true,
    }
  }
}

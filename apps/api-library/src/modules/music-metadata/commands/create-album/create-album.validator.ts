import { Injectable } from '@nestjs/common'

import { CreateAlbumCommand } from './create-album.command'
import { AlbumRepository, ArtistRepository, GenreRepository } from '../../repositories'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class CreateAlbumValidator implements Validator<CreateAlbumCommand> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(command: CreateAlbumCommand): Promise<ValidationResult> {
    const albumExists = await this.albumRepository.exists(command.name)

    if (albumExists) {
      return {
        isValid: false,
        errors: ['Album already exists'],
      }
    }

    if (command.artists.length > 0) {
      const artistExists = await this.artistRepository.existsAll(command.artists)

      if (!artistExists) {
        return {
          isValid: false,
          errors: ['Artists not found'],
        }
      }
    }

    if (command.genres.length > 0) {
      const genreExists = await this.genreRepository.existsAll(command.genres)

      if (!genreExists) {
        return {
          isValid: false,
          errors: ['Genres not found'],
        }
      }
    }

    return {
      isValid: true,
    }
  }
}

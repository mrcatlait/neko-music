import { Injectable } from '@nestjs/common'

import { AlbumRepository, ArtistRepository, GenreRepository } from '../../repositories'
import { CreateAlbumUseCaseParams } from './create-album.use-case'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class CreateAlbumValidator implements Validator<CreateAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateAlbumUseCaseParams): Promise<ValidationResult> {
    const albumExists = await this.albumRepository.exists(params.name)

    if (albumExists) {
      return {
        isValid: false,
        errors: ['Album already exists'],
      }
    }

    if (params.artists.length > 0) {
      const artistExists = await this.artistRepository.existsAll(params.artists)

      if (!artistExists) {
        return {
          isValid: false,
          errors: ['Artists not found'],
        }
      }
    }

    if (params.genres.length > 0) {
      const genreExists = await this.genreRepository.existsAll(params.genres)

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

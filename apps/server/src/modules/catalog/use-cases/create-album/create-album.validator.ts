import { Injectable } from '@nestjs/common'

import { AlbumRepository, ArtistRepository, GenreRepository } from '../../repositories'
import { CreateAlbumUseCaseParams } from './create-album.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateAlbumValidator implements Validator<CreateAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateAlbumUseCaseParams): Promise<ValidationResult> {
    const [albumExists, artistExists, genreExists] = await Promise.all([
      this.albumRepository.existsByName(params.name),
      this.artistRepository.existsMany(params.artists),
      this.genreRepository.existsMany(params.genres),
    ])

    const errors: string[] = []

    if (albumExists) {
      errors.push('Album already exists')
    }

    if (!artistExists) {
      errors.push('Artists not found')
    }

    if (!genreExists) {
      errors.push('Genres not found')
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
      }
    }

    return {
      isValid: true,
    }
  }
}

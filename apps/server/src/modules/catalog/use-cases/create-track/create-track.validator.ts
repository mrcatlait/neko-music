import { Injectable } from '@nestjs/common'

import { AlbumRepository, ArtistRepository, GenreRepository } from '../../repositories'
import { CreateTrackUseCaseParams } from './create-track.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateTrackValidator implements Validator<CreateTrackUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async validate(params: CreateTrackUseCaseParams): Promise<ValidationResult> {
    const [artistExists, genreExists, albumExists] = await Promise.all([
      this.artistRepository.existsMany(params.artists),
      this.genreRepository.existsMany(params.genres),
      this.albumRepository.exists(params.album),
    ])

    const errors: string[] = []

    if (!artistExists) {
      errors.push('Artists not found')
    }

    if (!genreExists) {
      errors.push('Genres not found')
    }

    if (!albumExists) {
      errors.push('Album not found')
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

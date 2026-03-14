import { Injectable } from '@nestjs/common'

import { UpdateBackstageArtistUseCaseParams } from './update-backstage-artist.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateBackstageArtistValidator implements Validator<UpdateBackstageArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: UpdateBackstageArtistUseCaseParams): Promise<ValidationResult> {
    const [artistExists, genresExist, nameTaken] = await Promise.all([
      this.artistRepository.findArtistById(params.artistId),
      this.genreRepository.findGenresByIds(params.genres),
      this.artistRepository.findArtistByNameExcluding(params.name, params.artistId),
    ])

    if (!artistExists) {
      return {
        isValid: false,
        error: 'Artist not found',
      }
    }

    if (genresExist.length !== params.genres.length) {
      return {
        isValid: false,
        error: 'Genres not found',
      }
    }

    if (nameTaken) {
      return {
        isValid: false,
        error: 'Artist name already taken',
      }
    }

    return {
      isValid: true,
    }
  }
}

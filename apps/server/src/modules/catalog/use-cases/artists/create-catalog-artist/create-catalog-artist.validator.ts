import { Injectable } from '@nestjs/common'

import { CreateCatalogArtistUseCaseParams } from './create-catalog-artist.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateCatalogArtistValidator implements Validator<CreateCatalogArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateCatalogArtistUseCaseParams): Promise<ValidationResult> {
    const [nameTaken, genresExist] = await Promise.all([
      this.artistRepository.findArtistByName(params.name),
      this.genreRepository.findGenresByIds(params.genres),
    ])

    if (nameTaken) {
      return {
        isValid: false,
        error: 'Artist name already taken',
      }
    }

    if (genresExist.length !== params.genres.length) {
      return {
        isValid: false,
        error: 'Genres not found',
      }
    }

    return { isValid: true }
  }
}

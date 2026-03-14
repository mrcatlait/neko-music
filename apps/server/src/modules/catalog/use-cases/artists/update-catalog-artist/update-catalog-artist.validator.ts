import { Injectable } from '@nestjs/common'

import { UpdateCatalogArtistUseCaseParams } from './update-catalog-artist.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateCatalogArtistValidator implements Validator<UpdateCatalogArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: UpdateCatalogArtistUseCaseParams): Promise<ValidationResult> {
    const [artistExists, genresExist, nameTaken] = await Promise.all([
      this.artistRepository.findArtistById(params.id),
      this.genreRepository.findGenresByIds(params.genres),
      this.artistRepository.findArtistByNameExcluding(params.name, params.id),
    ])

    if (!artistExists) {
      return {
        isValid: false,
        error: 'Catalog artist not found',
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

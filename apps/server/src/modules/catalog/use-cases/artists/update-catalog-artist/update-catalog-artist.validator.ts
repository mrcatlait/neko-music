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
      this.artistRepository.findArtistById(params.catalogArtistId),
      this.genreRepository.findGenresByIds(params.genres),
      this.artistRepository.findArtistByNameExcluding(params.name, params.catalogArtistId),
    ])

    const errors: string[] = []

    if (!artistExists) {
      errors.push('Catalog artist not found')
    }

    if (genresExist.length !== params.genres.length) {
      errors.push('Genres not found')
    }

    if (nameTaken) {
      errors.push('Artist name already taken')
    }

    return errors.length > 0 ? { isValid: false, errors } : { isValid: true }
  }
}

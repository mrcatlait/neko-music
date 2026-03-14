import { Injectable } from '@nestjs/common'

import { CreateCatalogAlbumUseCaseParams } from './create-catalog-album.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateCatalogAlbumValidator implements Validator<CreateCatalogAlbumUseCaseParams> {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async validate(params: CreateCatalogAlbumUseCaseParams): Promise<ValidationResult> {
    const [genresExist, artistResults] = await Promise.all([
      this.genreRepository.findGenresByIds(params.genres),
      Promise.all(params.artists.map((a) => this.artistRepository.findArtistById(a.artistId))),
    ])

    if (genresExist.length !== params.genres.length) {
      return {
        isValid: false,
        error: 'Genres not found',
      }
    }

    if (artistResults.some((a) => !a)) {
      return {
        isValid: false,
        error: 'One or more artists not found',
      }
    }

    return { isValid: true }
  }
}

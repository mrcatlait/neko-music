import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateCatalogAlbumUseCaseParams } from './create-catalog-album.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateCatalogAlbumValidator implements Validator<CreateCatalogAlbumUseCaseParams> {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async validate(params: CreateCatalogAlbumUseCaseParams): Promise<void> {
    const [genresExist, artistResults] = await Promise.all([
      this.genreRepository.findGenresByIds(params.genres),
      Promise.all(params.artists.map((a) => this.artistRepository.findArtistById(a.artistId))),
    ])

    if (genresExist.length !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }

    if (artistResults.some((a) => !a)) {
      throw new BadRequestException('One or more artists not found')
    }
  }
}

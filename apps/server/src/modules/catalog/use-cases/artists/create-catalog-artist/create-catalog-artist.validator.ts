import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateCatalogArtistUseCaseParams } from './create-catalog-artist.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateCatalogArtistValidator implements Validator<CreateCatalogArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateCatalogArtistUseCaseParams): Promise<void> {
    const [nameTaken, genresExist] = await Promise.all([
      this.artistRepository.findArtistByName(params.name),
      this.genreRepository.findGenresByIds(params.genres),
    ])

    if (nameTaken) {
      throw new BadRequestException('Artist name already taken')
    }

    if (genresExist.length !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }
  }
}

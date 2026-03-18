import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateCatalogArtistUseCaseParams } from './update-catalog-artist.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateCatalogArtistValidator implements Validator<UpdateCatalogArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: UpdateCatalogArtistUseCaseParams): Promise<void> {
    const [artistExists, genresExist, nameTaken] = await Promise.all([
      this.artistRepository.findArtistById(params.id),
      this.genreRepository.findGenresByIds(params.genres),
      this.artistRepository.findArtistByNameExcluding(params.name, params.id),
    ])

    if (!artistExists) {
      throw new BadRequestException('Catalog artist not found')
    }

    if (genresExist.length !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }

    if (nameTaken) {
      throw new BadRequestException('Artist name already taken')
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateBackstageAlbumUseCaseParams } from './create-backstage-album.use-case'
import { AlbumRepository, GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateBackstageAlbumValidator implements Validator<CreateBackstageAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  // todo add artists validation
  async validate(params: CreateBackstageAlbumUseCaseParams): Promise<void> {
    const [nameTaken, genresExist] = await Promise.all([
      this.albumRepository.findAlbumByName(params.name),
      this.genreRepository.findGenresByIds(params.genres),
    ])

    if (nameTaken) {
      throw new BadRequestException('Album name already taken')
    }

    if (genresExist.length !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }

    /**
     * @todo Validate artist IDs
     */
  }
}

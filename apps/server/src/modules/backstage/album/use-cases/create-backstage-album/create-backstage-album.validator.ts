import { BadRequestException, Injectable } from '@nestjs/common'

import { GenreRepository } from '../../../genre/repositories'
import { CreateBackstageAlbumUseCaseParams } from './create-backstage-album.use-case'
import { AlbumRepository } from '../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class CreateBackstageAlbumValidator implements Validator<CreateBackstageAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateBackstageAlbumUseCaseParams): Promise<void> {
    const [nameTaken, genreCount] = await Promise.all([
      this.albumRepository.exists({ name: params.name }),
      this.genreRepository.count(params.genres),
    ])

    if (nameTaken) {
      throw new BadRequestException('Album name already taken')
    }

    if (genreCount !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }
  }
}

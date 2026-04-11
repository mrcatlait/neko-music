import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateBackstageAlbumUseCaseParams } from './update-backstage-album.use-case'
import { AlbumRepository } from '../../repositories'
import { GenreRepository } from '../../../genre/repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class UpdateBackstageAlbumValidator implements Validator<UpdateBackstageAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: UpdateBackstageAlbumUseCaseParams): Promise<void> {
    const [albumExists, genreCount, albumsWithName] = await Promise.all([
      this.albumRepository.exists(params.id),
      this.genreRepository.count(params.genres),
      this.albumRepository.findMany({ name: params.name }),
    ])

    if (!albumExists) {
      throw new BadRequestException('Album not found')
    }

    if (genreCount !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }

    const nameTaken = albumsWithName.some((a) => a.id !== params.id)

    if (nameTaken) {
      throw new BadRequestException('Album name already taken')
    }
  }
}

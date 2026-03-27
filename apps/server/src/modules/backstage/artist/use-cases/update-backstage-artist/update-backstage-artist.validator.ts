import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateBackstageArtistUseCaseParams } from './update-backstage-artist.use-case'
import { ArtistRepository } from '../../repositories'
import { GenreRepository } from '../../../genre/repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class UpdateBackstageArtistValidator implements Validator<UpdateBackstageArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: UpdateBackstageArtistUseCaseParams): Promise<void> {
    const [artistExists, genreCount, artistsWithName] = await Promise.all([
      this.artistRepository.exists(params.id),
      this.genreRepository.count(params.genres),
      this.artistRepository.findMany({ name: params.name }),
    ])

    if (!artistExists) {
      throw new BadRequestException('Artist not found')
    }

    if (genreCount !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }

    const nameTaken = artistsWithName.some((a) => a.id !== params.id)

    if (nameTaken) {
      throw new BadRequestException('Artist name already taken')
    }
  }
}

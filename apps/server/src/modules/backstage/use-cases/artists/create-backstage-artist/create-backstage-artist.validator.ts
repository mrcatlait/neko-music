import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateBackstageArtistUseCaseParams } from './create-backstage-artist.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class CreateBackstageArtistValidator implements Validator<CreateBackstageArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateBackstageArtistUseCaseParams): Promise<void> {
    const [nameTaken, genresExist] = await Promise.all([
      this.artistRepository.exists({ name: params.name }),
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

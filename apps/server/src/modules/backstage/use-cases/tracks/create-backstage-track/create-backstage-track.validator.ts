import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateBackstageTrackUseCaseParams } from './create-backstage-track.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class CreateBackstageTrackValidator implements Validator<CreateBackstageTrackUseCaseParams> {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async validate(params: CreateBackstageTrackUseCaseParams): Promise<void> {
    const [genresExist, artistsCount] = await Promise.all([
      this.genreRepository.findGenresByIds(params.genres),
      this.artistRepository.count(params.artists.map((a) => a.id)),
    ])

    if (genresExist.length !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }

    if (artistsCount !== params.artists.length) {
      throw new BadRequestException('Artists not found')
    }
  }
}

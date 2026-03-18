import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateBackstageTrackUseCaseParams } from './create-backstage-track.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateBackstageTrackValidator implements Validator<CreateBackstageTrackUseCaseParams> {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async validate(params: CreateBackstageTrackUseCaseParams): Promise<void> {
    const [genresExist, artistsExist] = await Promise.all([
      this.genreRepository.findGenresByIds(params.genres),
      this.artistRepository.findArtistsByIds(params.artists.map((a) => a.id)),
    ])

    if (genresExist.length !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }

    if (artistsExist.length !== params.artists.length) {
      throw new BadRequestException('Artists not found')
    }
  }
}

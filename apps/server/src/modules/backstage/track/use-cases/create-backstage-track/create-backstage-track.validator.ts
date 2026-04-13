import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateBackstageTrackUseCaseParams } from './create-backstage-track.use-case'
import { TrackRepository } from '../../repositories'
import { GenreRepository } from '../../../genre/repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class CreateBackstageTrackValidator implements Validator<CreateBackstageTrackUseCaseParams> {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateBackstageTrackUseCaseParams): Promise<void> {
    const [nameTaken, genreCount] = await Promise.all([
      this.trackRepository.exists({ name: params.name }),
      this.genreRepository.count(params.genres),
    ])

    if (nameTaken) {
      throw new BadRequestException('Track name already taken')
    }

    if (genreCount !== params.genres.length) {
      throw new BadRequestException('Genres not found')
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common'

import { GenreRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { SyncPublishedGenreUseCaseParams } from './sync-published-genre.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class SyncPublishedGenreValidator implements Validator<SyncPublishedGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: SyncPublishedGenreUseCaseParams): Promise<void> {
    const genre = await this.genreRepository.findOne(params.genreId)

    if (!genre) {
      throw new BadRequestException(`Genre ${params.genreId} not found`)
    }

    if (genre.status !== PublishingStatus.Published) {
      throw new BadRequestException('Genre is not published')
    }
  }
}

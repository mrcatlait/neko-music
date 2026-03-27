import { BadRequestException, Injectable } from '@nestjs/common'

import { GenreRepository } from '../../repositories'
import { CreateGenreUseCaseParams } from './create-genre.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class CreateGenreValidator implements Validator<CreateGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: CreateGenreUseCaseParams): Promise<void> {
    const [nameExists, slugExists] = await Promise.all([
      this.genreRepository.exists({ name: params.name }),
      this.genreRepository.exists({ slug: params.slug }),
    ])

    if (nameExists || slugExists) {
      throw new BadRequestException('Genre already exists')
    }
  }
}

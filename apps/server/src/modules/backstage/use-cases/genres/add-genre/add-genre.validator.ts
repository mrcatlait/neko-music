import { BadRequestException, Injectable } from '@nestjs/common'

import { AddGenreUseCaseParams } from './add-genre.use-case'
import { GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class AddGenreValidator implements Validator<AddGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: AddGenreUseCaseParams): Promise<void> {
    const [nameTaken, slugTaken] = await Promise.all([
      this.genreRepository.findOne({ name: params.name }),
      this.genreRepository.findOne({ slug: params.slug }),
    ])

    if (nameTaken || slugTaken) {
      throw new BadRequestException('Genre already exists')
    }
  }
}

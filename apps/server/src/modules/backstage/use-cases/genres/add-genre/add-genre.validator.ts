import { BadRequestException, Injectable } from '@nestjs/common'

import { AddGenreUseCaseParams } from './add-genre.use-case'
import { GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class AddGenreValidator implements Validator<AddGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: AddGenreUseCaseParams): Promise<void> {
    const genreExists = await this.genreRepository.findGenreByName(params.name)

    if (genreExists) {
      throw new BadRequestException('Genre already exists')
    }
  }
}

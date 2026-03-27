import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateGenreUseCaseParams } from './update-genre.use-case'
import { GenreRepository } from '../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class UpdateGenreValidator implements Validator<UpdateGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: UpdateGenreUseCaseParams): Promise<void> {
    const [genreExists, genreWithName] = await Promise.all([
      this.genreRepository.exists(params.id),
      this.genreRepository.findOne({ name: params.name }),
    ])

    if (!genreExists) {
      throw new BadRequestException('Genre not found')
    }

    if (genreWithName && genreWithName.id !== params.id) {
      throw new BadRequestException('Genre already exists')
    }
  }
}

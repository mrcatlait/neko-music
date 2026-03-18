import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateGenreUseCaseParams } from './update-genre.use-case'
import { GenreRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateGenreValidator implements Validator<UpdateGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: UpdateGenreUseCaseParams): Promise<void> {
    const [genreExists, hasGenre] = await Promise.all([
      this.genreRepository.findGenreByName(params.name),
      this.genreRepository.findGenreById(params.id),
    ])

    if (!hasGenre) {
      throw new BadRequestException('Genre not found')
    }

    if (genreExists) {
      throw new BadRequestException('Genre already exists')
    }
  }
}

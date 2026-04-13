import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateBackstageGenreUseCaseParams } from './update-backstage-genre.use-case'
import { GenreRepository } from '../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class UpdateBackstageGenreValidator implements Validator<UpdateBackstageGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: UpdateBackstageGenreUseCaseParams): Promise<void> {
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

import { BadRequestException, Injectable } from '@nestjs/common'

import { GenreRepository } from '../../repositories'
import { CreateBackstageGenreUseCaseParams } from './create-backstage-genre.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class CreateBackstageGenreValidator implements Validator<CreateBackstageGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: CreateBackstageGenreUseCaseParams): Promise<void> {
    const [nameTaken, slugTaken] = await Promise.all([
      this.genreRepository.exists({ name: params.name }),
      this.genreRepository.exists({ slug: params.slug }),
    ])

    if (nameTaken || slugTaken) {
      throw new BadRequestException('Genre name or slug already taken')
    }
  }
}

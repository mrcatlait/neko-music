import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreRepository } from '../../repositories'
import { CreateGenreValidator } from './create-genre.validator'
import { BackstageGenreTable } from '../../../backstage.schema'
import { PublishingStatus } from '../../../shared/enums'

export interface CreateGenreUseCaseParams {
  readonly name: string
  readonly slug: string
  readonly userId: string
}

export type CreateGenreUseCaseResult = Selectable<BackstageGenreTable>

@Injectable()
export class CreateGenreUseCase {
  constructor(
    private readonly createGenreValidator: CreateGenreValidator,
    private readonly genreRepository: GenreRepository,
  ) {}

  async invoke(params: CreateGenreUseCaseParams): Promise<CreateGenreUseCaseResult> {
    await this.createGenreValidator.validate(params)

    return this.genreRepository.create({
      name: params.name,
      slug: params.slug,
      status: PublishingStatus.Draft,
      createdBy: params.userId,
      updatedBy: params.userId,
    })
  }
}

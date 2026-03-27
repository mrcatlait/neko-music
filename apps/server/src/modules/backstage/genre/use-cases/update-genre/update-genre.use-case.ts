import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { UpdateGenreValidator } from './update-genre.validator'
import { GenreRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'
import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'

export interface UpdateGenreUseCaseParams {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly userId: string
}

export type UpdateGenreUseCaseResult = Selectable<BackstageGenreTable>

@Injectable()
export class UpdateGenreUseCase implements UseCase<UpdateGenreUseCaseParams, UpdateGenreUseCaseResult> {
  constructor(
    private readonly updateGenreValidator: UpdateGenreValidator,
    private readonly genreRepository: GenreRepository,
  ) {}

  async invoke(params: UpdateGenreUseCaseParams): Promise<UpdateGenreUseCaseResult> {
    await this.updateGenreValidator.validate(params)

    return this.genreRepository.update(params.id, {
      name: params.name,
      slug: params.slug,
      updatedAt: new Date(),
      updatedBy: params.userId,
    })
  }
}

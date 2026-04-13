import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { UpdateBackstageGenreValidator } from './update-backstage-genre.validator'
import { GenreRepository } from '../../repositories'
import { ProcessBackstageGenreLifecycleUseCase } from '../process-backstage-genre-lifecycle'

import { UseCase } from '@/modules/shared/types'
import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'

export interface UpdateBackstageGenreUseCaseParams {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly userId: string
}

export type UpdateBackstageGenreUseCaseResult = Selectable<BackstageGenreTable>

@Injectable()
export class UpdateBackstageGenreUseCase implements UseCase<
  UpdateBackstageGenreUseCaseParams,
  UpdateBackstageGenreUseCaseResult
> {
  constructor(
    private readonly updateBackstageGenreValidator: UpdateBackstageGenreValidator,
    private readonly genreRepository: GenreRepository,
    private readonly processBackstageGenreLifecycleUseCase: ProcessBackstageGenreLifecycleUseCase,
  ) {}

  async invoke(params: UpdateBackstageGenreUseCaseParams): Promise<UpdateBackstageGenreUseCaseResult> {
    await this.updateBackstageGenreValidator.validate(params)

    const genre = await this.genreRepository.update(params.id, {
      name: params.name,
      slug: params.slug,
      updatedAt: new Date(),
      updatedBy: params.userId,
    })

    await this.processBackstageGenreLifecycleUseCase.invoke({
      genreId: genre.id,
    })

    return genre
  }
}

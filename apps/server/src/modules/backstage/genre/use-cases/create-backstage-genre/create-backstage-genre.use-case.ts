import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreRepository } from '../../repositories'
import { CreateBackstageGenreValidator } from './create-backstage-genre.validator'
import { BackstageGenreTable } from '../../../backstage.schema'
import { PublishingStatus } from '../../../shared/enums'
import { ProcessBackstageGenreLifecycleUseCase } from '../process-backstage-genre-lifecycle'

import { UseCase } from '@/modules/shared/types'

export interface CreateBackstageGenreUseCaseParams {
  readonly name: string
  readonly slug: string
  readonly userId: string
}

export type CreateBackstageGenreUseCaseResult = Selectable<BackstageGenreTable>

@Injectable()
export class CreateBackstageGenreUseCase implements UseCase<
  CreateBackstageGenreUseCaseParams,
  CreateBackstageGenreUseCaseResult
> {
  constructor(
    private readonly createBackstageGenreValidator: CreateBackstageGenreValidator,
    private readonly genreRepository: GenreRepository,
    private readonly processBackstageGenreLifecycleUseCase: ProcessBackstageGenreLifecycleUseCase,
  ) {}

  async invoke(params: CreateBackstageGenreUseCaseParams): Promise<CreateBackstageGenreUseCaseResult> {
    await this.createBackstageGenreValidator.validate(params)

    const genre = await this.genreRepository.create({
      name: params.name,
      slug: params.slug,
      status: PublishingStatus.Draft,
      createdBy: params.userId,
      updatedBy: params.userId,
    })

    await this.processBackstageGenreLifecycleUseCase.invoke({
      genreId: genre.id,
    })

    return genre
  }
}

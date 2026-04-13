import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { SyncPublishedGenreValidator } from './sync-published-genre.validator'
import { GetBackstageGenreUseCase } from '../get-backstage-genre'

import { UseCase } from '@/modules/shared/types'

export interface SyncPublishedGenreUseCaseParams {
  readonly genreId: string
}

export type SyncPublishedGenreUseCaseResult = void

@Injectable()
export class SyncPublishedGenreUseCase implements UseCase<
  SyncPublishedGenreUseCaseParams,
  SyncPublishedGenreUseCaseResult
> {
  constructor(
    private readonly syncPublishedGenreValidator: SyncPublishedGenreValidator,
    private readonly getBackstageGenreUseCase: GetBackstageGenreUseCase,
  ) {}

  async invoke(params: SyncPublishedGenreUseCaseParams): Promise<SyncPublishedGenreUseCaseResult> {
    await this.syncPublishedGenreValidator.validate(params)

    const genre = await this.getBackstageGenreUseCase.invoke({ id: params.genreId })

    return
  }
}

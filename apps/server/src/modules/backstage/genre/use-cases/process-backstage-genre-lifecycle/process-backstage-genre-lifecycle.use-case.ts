import { Inject, Injectable } from '@nestjs/common'

import { GenreRepository } from '../../repositories'
import { SyncPublishedGenreUseCase } from '../sync-published-genre'

import { UseCase } from '@/modules/shared/types'
import { PublishingStatus } from '@/modules/backstage/shared/enums'
import { BACKSTAGE_MODULE_OPTIONS } from '@/modules/backstage/tokens'
import { BackstageModuleOptions } from '@/modules/backstage/types'

export interface ProcessBackstageGenreLifecycleUseCaseParams {
  readonly genreId: string
}

export type ProcessBackstageGenreLifecycleUseCaseResult = void

@Injectable()
export class ProcessBackstageGenreLifecycleUseCase implements UseCase<
  ProcessBackstageGenreLifecycleUseCaseParams,
  ProcessBackstageGenreLifecycleUseCaseResult
> {
  private readonly autoPublish: boolean

  constructor(
    @Inject(BACKSTAGE_MODULE_OPTIONS) private readonly options: BackstageModuleOptions,
    private readonly genreRepository: GenreRepository,
    private readonly syncPublishedGenreUseCase: SyncPublishedGenreUseCase,
  ) {
    this.autoPublish = options.autoPublish ?? false
  }

  async invoke(
    params: ProcessBackstageGenreLifecycleUseCaseParams,
  ): Promise<ProcessBackstageGenreLifecycleUseCaseResult> {
    const genre = await this.genreRepository.findOne(params.genreId)

    if (!genre) {
      throw new Error('Genre not found')
    }

    if (genre.status === PublishingStatus.Published) {
      return this.syncPublishedGenreUseCase.invoke({ genreId: params.genreId })
    }

    if (!this.autoPublish) {
      throw new Error('Not implemented')
    }

    await this.genreRepository.update(params.genreId, {
      status: PublishingStatus.Published,
    })

    return this.syncPublishedGenreUseCase.invoke({ genreId: params.genreId })
  }
}

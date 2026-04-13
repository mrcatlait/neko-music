import { Inject, Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { SyncPublishedArtistUseCase } from '../sync-published-artist'

import { UseCase } from '@/modules/shared/types'
import { PublishingStatus } from '@/modules/backstage/shared/enums'
import { BACKSTAGE_MODULE_OPTIONS } from '@/modules/backstage/tokens'
import { BackstageModuleOptions } from '@/modules/backstage/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

export interface ProcessBackstageArtistLifecycleUseCaseParams {
  readonly artistId: string
}

export type ProcessBackstageArtistLifecycleUseCaseResult = void

@Injectable()
export class ProcessBackstageArtistLifecycleUseCase implements UseCase<
  ProcessBackstageArtistLifecycleUseCaseParams,
  ProcessBackstageArtistLifecycleUseCaseResult
> {
  private readonly autoPublish: boolean

  constructor(
    @Inject(BACKSTAGE_MODULE_OPTIONS) private readonly options: BackstageModuleOptions,
    private readonly artistRepository: ArtistRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
    private readonly syncPublishedArtistUseCase: SyncPublishedArtistUseCase,
  ) {
    this.autoPublish = options.autoPublish ?? false
  }

  async invoke(
    params: ProcessBackstageArtistLifecycleUseCaseParams,
  ): Promise<ProcessBackstageArtistLifecycleUseCaseResult> {
    const artist = await this.artistRepository.findOne(params.artistId)

    if (!artist) {
      throw new Error('Artist not found')
    }

    if (artist.status === PublishingStatus.Published) {
      return this.syncPublishedArtistUseCase.invoke({ artistId: params.artistId })
    }

    if (!this.autoPublish) {
      throw new Error('Not implemented')
    }

    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Artist,
      entityId: params.artistId,
    })

    if (!mediaReadiness.ready) {
      return
    }

    await this.artistRepository.update(params.artistId, {
      status: PublishingStatus.Published,
    })

    return this.syncPublishedArtistUseCase.invoke({ artistId: params.artistId })
  }
}

import { Inject, Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { SyncPublishedAlbumUseCase } from '../sync-published-album'

import { UseCase } from '@/modules/shared/types'
import { PublishingStatus } from '@/modules/backstage/shared/enums'
import { BACKSTAGE_MODULE_OPTIONS } from '@/modules/backstage/tokens'
import { BackstageModuleOptions } from '@/modules/backstage/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'
import { TrackRepository } from '@/modules/backstage/track/repositories'

export interface ProcessBackstageAlbumLifecycleUseCaseParams {
  readonly albumId: string
}

export type ProcessBackstageAlbumLifecycleUseCaseResult = void

@Injectable()
export class ProcessBackstageAlbumLifecycleUseCase implements UseCase<
  ProcessBackstageAlbumLifecycleUseCaseParams,
  ProcessBackstageAlbumLifecycleUseCaseResult
> {
  private readonly autoPublish: boolean

  constructor(
    @Inject(BACKSTAGE_MODULE_OPTIONS) private readonly options: BackstageModuleOptions,
    private readonly albumRepository: AlbumRepository,
    private readonly trackRepository: TrackRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
    private readonly syncPublishedAlbumUseCase: SyncPublishedAlbumUseCase,
  ) {
    this.autoPublish = options.autoPublish ?? false
  }

  async invoke(
    params: ProcessBackstageAlbumLifecycleUseCaseParams,
  ): Promise<ProcessBackstageAlbumLifecycleUseCaseResult> {
    const album = await this.albumRepository.findOne(params.albumId)

    if (!album) {
      throw new Error('Album not found')
    }

    if (album.status === PublishingStatus.Published) {
      return this.syncPublishedAlbumUseCase.invoke({ albumId: params.albumId })
    }

    if (!this.autoPublish) {
      throw new Error('Not implemented')
    }

    const albumMedia = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Album,
      entityId: params.albumId,
    })

    if (!albumMedia.ready) {
      return
    }

    const tracks = await this.trackRepository.findMany({ albumId: params.albumId })

    if (tracks.length === 0) {
      return
    }

    const trackReadiness = await Promise.all(
      tracks.map((track) =>
        this.getMediaReadinessUseCase.invoke({
          entityType: EntityType.Track,
          entityId: track.id,
        }),
      ),
    )

    const allTracksReady = trackReadiness.every((item) => item.ready)

    if (!allTracksReady) {
      return
    }

    await this.albumRepository.update(params.albumId, {
      status: PublishingStatus.Published,
    })

    return this.syncPublishedAlbumUseCase.invoke({ albumId: params.albumId })
  }
}

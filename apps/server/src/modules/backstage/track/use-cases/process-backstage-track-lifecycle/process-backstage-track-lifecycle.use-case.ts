import { Inject, Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { SyncPublishedTrackUseCase } from '../sync-published-track'

import { UseCase } from '@/modules/shared/types'
import { PublishingStatus } from '@/modules/backstage/shared/enums'
import { BACKSTAGE_MODULE_OPTIONS } from '@/modules/backstage/tokens'
import { BackstageModuleOptions } from '@/modules/backstage/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'
import { AlbumRepository } from '@/modules/backstage/album/repositories'

export interface ProcessBackstageTrackLifecycleUseCaseParams {
  readonly trackId: string
}

export type ProcessBackstageTrackLifecycleUseCaseResult = void

@Injectable()
export class ProcessBackstageTrackLifecycleUseCase implements UseCase<
  ProcessBackstageTrackLifecycleUseCaseParams,
  ProcessBackstageTrackLifecycleUseCaseResult
> {
  private readonly autoPublish: boolean

  constructor(
    @Inject(BACKSTAGE_MODULE_OPTIONS) private readonly options: BackstageModuleOptions,
    private readonly albumRepository: AlbumRepository,
    private readonly trackRepository: TrackRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
    private readonly syncPublishedTrackUseCase: SyncPublishedTrackUseCase,
  ) {
    this.autoPublish = options.autoPublish ?? false
  }

  async invoke(
    params: ProcessBackstageTrackLifecycleUseCaseParams,
  ): Promise<ProcessBackstageTrackLifecycleUseCaseResult> {
    const track = await this.trackRepository.findOne(params.trackId)

    if (!track) {
      throw new Error('Track not found')
    }

    if (track.status === PublishingStatus.Published) {
      return this.syncPublishedTrackUseCase.invoke({ trackId: params.trackId })
    }

    if (!this.autoPublish) {
      throw new Error('Not implemented')
    }

    const hasArtwork = Boolean(track.artwork)

    if (!hasArtwork) {
      return
    }

    const trackMedia = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Track,
      entityId: params.trackId,
    })

    if (!trackMedia.ready) {
      return
    }

    const album = await this.albumRepository.findOne({ id: track.albumId })

    if (!album) {
      throw new Error('Album not found')
    }

    const hasUnpublishedAlbum = album.status !== PublishingStatus.Published

    if (hasUnpublishedAlbum) {
      return
    }

    await this.trackRepository.update(params.trackId, {
      status: PublishingStatus.Published,
    })

    return this.syncPublishedTrackUseCase.invoke({ trackId: params.trackId })
  }
}

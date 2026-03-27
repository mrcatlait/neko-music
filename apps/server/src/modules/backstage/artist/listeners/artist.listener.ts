import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { SyncArtistUseCase, UpdateArtistStatusUseCase } from '../use-cases'
import { PublishingStatus } from '../../shared/enums'

import { EntityType } from '@/modules/media/enums'
import { MediaProcessingFailedEvent, MediaProcessingStartedEvent, MediaReadyEvent } from '@/modules/media/events'

@Injectable()
export class ArtistListener {
  constructor(
    private readonly updateArtistStatusUseCase: UpdateArtistStatusUseCase,
    private readonly syncArtistUseCase: SyncArtistUseCase,
  ) {}

  @OnEvent(MediaProcessingStartedEvent.event)
  handleMediaProcessingStartedEvent({ payload }: MediaProcessingStartedEvent): Promise<void> | void {
    if (payload.entityType !== EntityType.Artist) return

    return this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.Draft,
    })
  }

  @OnEvent(MediaReadyEvent.event)
  async handleMediaReadyEvent({ payload }: MediaReadyEvent): Promise<void> {
    if (payload.entityType !== EntityType.Artist) return

    await this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.Published,
    })

    return this.syncArtistUseCase
      .invoke({
        artistId: payload.entityId,
      })
      .then(() => undefined)
  }

  @OnEvent(MediaProcessingFailedEvent.event)
  handleMediaProcessingFailedEvent({ payload }: MediaProcessingFailedEvent): Promise<void> | void {
    if (payload.entityType !== EntityType.Artist) return

    return this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.Rejected,
    })
  }
}

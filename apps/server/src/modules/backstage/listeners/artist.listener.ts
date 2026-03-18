import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { SyncArtistUseCase, UpdateArtistStatusUseCase } from '../use-cases'
import { PublishingStatus } from '../enums'

import { MediaProcessingFailedEvent, MediaProcessingStartedEvent, MediaReadyEvent } from '@/modules/shared/events'
import { EntityType } from '@/modules/media/enums'

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
      status: PublishingStatus.Processing,
    })
  }

  @OnEvent(MediaReadyEvent.event)
  async handleMediaReadyEvent({ payload }: MediaReadyEvent): Promise<void> {
    if (payload.entityType !== EntityType.Artist) return

    await this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.Ready,
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
      status: PublishingStatus.Failed,
    })
  }
}

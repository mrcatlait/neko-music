import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { PublishArtistUseCase, UpdateArtistStatusUseCase } from '../use-cases'
import { PublishingStatus } from '../enums'

import {
  MediaProcessingCompletedEvent,
  MediaProcessingFailedEvent,
  MediaProcessingStartedEvent,
} from '@/modules/shared/events'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class ArtistListener {
  constructor(
    private readonly updateArtistStatusUseCase: UpdateArtistStatusUseCase,
    private readonly publishArtistUseCase: PublishArtistUseCase,
  ) {}

  @OnEvent(MediaProcessingStartedEvent.event)
  handleMediaProcessingStartedEvent({ payload }: MediaProcessingStartedEvent): Promise<void> | void {
    if (payload.entityType !== EntityType.ARTIST) return

    return this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.PROCESSING,
    })
  }

  @OnEvent(MediaProcessingCompletedEvent.event)
  handleMediaProcessingCompletedEvent({ payload }: MediaProcessingCompletedEvent): Promise<void> | void {
    if (payload.entityType !== EntityType.ARTIST) return

    return this.publishArtistUseCase.invoke({
      artistId: payload.entityId,
    })
  }

  @OnEvent(MediaProcessingFailedEvent.event)
  handleMediaProcessingFailedEvent({ payload }: MediaProcessingFailedEvent): Promise<void> | void {
    if (payload.entityType !== EntityType.ARTIST) return

    return this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.DRAFT,
    })
  }
}

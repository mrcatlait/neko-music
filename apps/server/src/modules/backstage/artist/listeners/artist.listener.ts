import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { UpdateBackstageArtistArtworkUseCase } from '../use-cases'

import { EntityType } from '@/modules/media/enums'
import { MediaReadyEvent } from '@/modules/media/events'

@Injectable()
export class ArtistListener {
  constructor(private readonly updateBackstageArtistArtworkUseCase: UpdateBackstageArtistArtworkUseCase) {}

  @OnEvent(MediaReadyEvent.event)
  handleMediaReadyEvent({ payload }: MediaReadyEvent): Promise<void> {
    if (payload.entityType !== EntityType.Artist) return Promise.resolve()

    return this.updateBackstageArtistArtworkUseCase.invoke({
      id: payload.entityId,
    })
  }
}

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { UpdateBackstageAlbumArtworkUseCase } from '../use-cases'

import { EntityType } from '@/modules/media/enums'
import { MediaReadyEvent } from '@/modules/media/events'

@Injectable()
export class AlbumListener {
  constructor(private readonly updateBackstageAlbumArtworkUseCase: UpdateBackstageAlbumArtworkUseCase) {}

  @OnEvent(MediaReadyEvent.event)
  handleMediaReadyEvent({ payload }: MediaReadyEvent): Promise<void> {
    if (payload.entityType !== EntityType.Album) return Promise.resolve()

    return this.updateBackstageAlbumArtworkUseCase.invoke({
      id: payload.entityId,
    })
  }
}

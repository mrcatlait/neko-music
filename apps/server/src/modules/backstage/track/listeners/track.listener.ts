import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { UpdateBackstageTrackPlaybackUseCase } from '../use-cases'

import { EntityType } from '@/modules/media/enums'
import { MediaReadyEvent } from '@/modules/media/events'

@Injectable()
export class TrackListener {
  constructor(private readonly updateBackstageTrackPlaybackUseCase: UpdateBackstageTrackPlaybackUseCase) {}

  @OnEvent(MediaReadyEvent.event)
  handleMediaReadyEvent({ payload }: MediaReadyEvent): Promise<void> {
    if (payload.entityType !== EntityType.Track) return Promise.resolve()

    return this.updateBackstageTrackPlaybackUseCase.invoke({
      id: payload.entityId,
    })
  }
}

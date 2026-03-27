import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'

import { AssetCleanupService, ProcessingPipelineService } from '../services'
import { MediaUploadedEvent, MediaProcessingCompletedEvent, MediaReadyEvent } from '../events'

@Injectable()
export class MediaListener {
  constructor(
    private readonly assetCleanupService: AssetCleanupService,
    private readonly eventEmitter: EventEmitter2,
    private readonly processingPipelineService: ProcessingPipelineService,
  ) {}

  @OnEvent(MediaProcessingCompletedEvent.event)
  async handleMediaProcessingCompletedEvent({ payload }: MediaProcessingCompletedEvent): Promise<void> {
    await this.assetCleanupService.cleanupSourceAssetsForEntity(
      payload.entityType,
      payload.entityId,
      payload.sourceAssetId,
    )

    this.eventEmitter.emit(
      MediaReadyEvent.event,
      new MediaReadyEvent({
        entityType: payload.entityType,
        entityId: payload.entityId,
      }),
    )
  }

  @OnEvent(MediaUploadedEvent.event)
  handleMediaUploadedEvent(): void {
    this.processingPipelineService.next()
  }
}

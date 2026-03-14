import { AbstractEvent } from '../classes'

import { EntityType } from '@/modules/media/enums'

interface MediaProcessingCompletedEventPayload {
  sourceAssetId: string
  entityType: EntityType
  entityId: string
}

export class MediaProcessingCompletedEvent extends AbstractEvent<MediaProcessingCompletedEventPayload> {
  static readonly event = 'media.processing.completed'
}

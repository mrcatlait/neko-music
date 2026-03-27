import { EntityType } from '../enums'

import { AbstractEvent } from '@/modules/shared/classes'

interface MediaProcessingCompletedEventPayload {
  sourceAssetId: string
  entityType: EntityType
  entityId: string
}

export class MediaProcessingCompletedEvent extends AbstractEvent<MediaProcessingCompletedEventPayload> {
  static readonly event = 'media.processing.completed'
}

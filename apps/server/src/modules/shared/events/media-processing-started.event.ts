import { AbstractEvent } from '../classes'

import { EntityType } from '@/modules/media/enums'

interface MediaProcessingStartedEventPayload {
  entityType: EntityType
  entityId: string
}

export class MediaProcessingStartedEvent extends AbstractEvent<MediaProcessingStartedEventPayload> {
  static readonly event = 'media.processing.started'
}

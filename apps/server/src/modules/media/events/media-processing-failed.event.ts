import { AbstractEvent } from '@/modules/shared/classes'
import { EntityType } from '@/modules/media/enums'

interface MediaProcessingFailedEventPayload {
  entityType: EntityType
  entityId: string
}

export class MediaProcessingFailedEvent extends AbstractEvent<MediaProcessingFailedEventPayload> {
  static readonly event = 'media.processing.failed'
}

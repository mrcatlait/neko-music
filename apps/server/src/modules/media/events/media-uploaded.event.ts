import { EntityType } from '../enums'

import { AbstractEvent } from '@/modules/shared/classes'

interface MediaUploadedEventPayload {
  entityType: EntityType
  entityId: string
}

export class MediaUploadedEvent extends AbstractEvent<MediaUploadedEventPayload> {
  static readonly event = 'media.uploaded'
}

import { AbstractEvent } from '@/modules/shared/classes'
import { EntityType } from '@/modules/media/enums'

interface MediaReadyEventPayload {
  entityType: EntityType
  entityId: string
}

export class MediaReadyEvent extends AbstractEvent<MediaReadyEventPayload> {
  static readonly event = 'media.ready'
}

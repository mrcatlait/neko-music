import { EntityType, MediaType } from '@modules/media/shared/enums'

export interface CreateUploadTokenCommand {
  userId: string
  entityId: string
  entityType: EntityType
  mediaType: MediaType
}

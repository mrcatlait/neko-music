import { UploadEntityType } from '@modules/media/shared/enums'

export interface CreateUploadTokenCommand {
  userId: string
  entityId: string
  entityType: UploadEntityType
}

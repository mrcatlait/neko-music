import { CollectionType } from '@common/enums'
import { PageOptionsDto } from '@common/dto'

export interface GetCollectionMembershipQuery {
  userId: string
  itemId: string
  itemType: CollectionType
  pageOptionsDto: PageOptionsDto
}

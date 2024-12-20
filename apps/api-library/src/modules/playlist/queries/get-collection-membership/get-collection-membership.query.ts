import { CollectionType } from '@modules/shared/enums'
import { PageOptionsDto } from '@modules/shared/dtos'

export interface GetCollectionMembershipQuery {
  userId: string
  collectionId: string
  collectionType: CollectionType
  pageOptionsDto: PageOptionsDto
}

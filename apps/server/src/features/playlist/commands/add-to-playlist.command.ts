import { CollectionType } from '@common/enums'

export interface AddToPlaylistCommand {
  playlistId: string
  itemId: string
  itemType: CollectionType
  userId: string
}

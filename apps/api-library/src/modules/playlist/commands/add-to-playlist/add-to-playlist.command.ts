import { CollectionType } from '@modules/shared/enums'

export interface AddToPlaylistCommand {
  playlistId: string
  collectionId: string
  collectionType: CollectionType
  userId: string
}

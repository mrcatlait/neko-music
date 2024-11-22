import { PlaylistType } from '../enums'

export interface CreatePlaylistCommand {
  userId: string
  name: string
  description: string
  type: PlaylistType
}

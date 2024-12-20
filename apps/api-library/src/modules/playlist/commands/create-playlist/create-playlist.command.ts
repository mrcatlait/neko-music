import { PlaylistType } from '@modules/playlist/enums'

export interface CreatePlaylistCommand {
  userId: string
  name: string
  description: string
  type: PlaylistType
}

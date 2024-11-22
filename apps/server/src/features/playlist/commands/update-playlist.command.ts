import { PlaylistType } from '../enums'

export interface UpdatePlaylistCommand {
  playlistId: string
  userId: string
  name: string
  description: string
  type: PlaylistType
}

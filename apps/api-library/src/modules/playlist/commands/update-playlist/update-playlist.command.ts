import { PlaylistType } from '../../enums'

export interface UpdatePlaylistCommand {
  userId: string
  playlistId: string
  name: string
  description: string
  type: PlaylistType
}

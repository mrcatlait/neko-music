import { PlaylistType } from '../enums'

export interface Playlist {
  id: string
  name: string
  description: string
  type: PlaylistType
}

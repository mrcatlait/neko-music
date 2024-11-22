import { PlaylistType } from '../enums'

export interface PlaylistEntity {
  id: string
  name: string
  description: string
  type: PlaylistType
  user_id: string
}

import { PlaylistType } from '../enums'

export interface PlaylistMetadataEntity {
  id: string
  name: string
  description: string
  type: PlaylistType
  tracks?: never
  images?: never
}

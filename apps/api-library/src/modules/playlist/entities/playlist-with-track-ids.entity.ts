import { ImageEntity } from '@modules/shared/entities'

export interface PlaylistWithTrackIdsEntity {
  id: string
  name: string
  images: ImageEntity[]
  tracks?: string[]
}

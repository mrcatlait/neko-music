import { ImageEntity } from '@common/entities'

export interface PlaylistWithTrackIdsEntity {
  id: string
  name: string
  images: ImageEntity[]
  tracks?: string[]
}

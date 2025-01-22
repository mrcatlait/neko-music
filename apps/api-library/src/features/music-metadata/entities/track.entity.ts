import { TrackArtistEntity } from './track-artist.entity'

import { ImageEntity } from '@common/entities'

export interface TrackEntity {
  id: string
  title: string
  duration: number
  artists: TrackArtistEntity[]
  images: ImageEntity[]
}

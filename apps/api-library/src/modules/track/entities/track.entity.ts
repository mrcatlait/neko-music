import { TrackArtistEntity } from './track-artist.entity'

import { ImageEntity } from '@modules/shared/entities'

export interface TrackEntity {
  id: string
  title: string
  duration: number
  artists: TrackArtistEntity[]
  images: ImageEntity[]
}

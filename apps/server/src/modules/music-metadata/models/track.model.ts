import { TrackArtist } from './track-artist.model'

import { Image } from '@modules/shared/models'

export interface Track {
  id: string
  title: string
  duration: number
  artists: TrackArtist[]
  images: Image[]
}

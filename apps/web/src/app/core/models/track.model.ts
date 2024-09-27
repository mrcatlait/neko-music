import { Image } from './image.model'

import { ArtistRole } from '@core/enum'

export interface TrackArtist {
  id: string
  name: string
  role: ArtistRole
}

export interface Track {
  id: string
  title: string
  images: Image[]
  artists: TrackArtist[]
  duration: number
  genres: string[]
}

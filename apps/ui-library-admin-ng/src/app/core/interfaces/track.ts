import { Image } from '@neko/ui-shared/interfaces'

import { ArtistRole } from '@core/enums'

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

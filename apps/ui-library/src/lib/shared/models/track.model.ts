import type { ArtistRole } from "../enums"
import type { Image } from "./image.model"

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

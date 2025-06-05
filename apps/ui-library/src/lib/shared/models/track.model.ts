import type { ArtistRole } from "../enums"
import type { Artwork } from "./artwork.model"

export interface TrackArtist {
  id: string
  name: string
  role: ArtistRole
}

export interface Track {
  id: string
  title: string
  artwork: Artwork
  artists: TrackArtist[]
  duration: number
  genres: string[]
}

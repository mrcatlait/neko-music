import type { Artwork } from './artwork.model'

export interface Artist {
  id: string
  name: string
  verified: boolean
  artwork: Artwork
}

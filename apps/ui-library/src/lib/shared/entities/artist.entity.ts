import type { Artwork } from './artwork.entity'

export interface Artist {
  id: string
  name: string
  verified: boolean
  artwork: Artwork
}

import type { Artwork } from './artwork'

export interface Artist {
  id: string
  name: string
  verified: boolean
  artwork: Artwork
}

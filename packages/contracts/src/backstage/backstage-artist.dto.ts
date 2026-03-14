import { ArtworkDto } from '../shared'

export interface BackstageArtistDto {
  id: string
  name: string
  verified: boolean
  status: string
  genres: string[]
  artwork: ArtworkDto | null
}

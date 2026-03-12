import { ArtworkDto } from '../shared'

export interface BackstageArtistDto {
  id: string
  name: string
  verified: boolean
  status: 'DRAFT' | 'PROCESSING' | 'PUBLISHED' | 'REJECTED'
  genres: string[]
  artwork: ArtworkDto | null
}

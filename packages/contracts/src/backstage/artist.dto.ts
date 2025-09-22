import { ArtworkDto } from '../shared'

export interface ArtistDto {
  id: string
  name: string
  verified: boolean
  artwork: ArtworkDto
}

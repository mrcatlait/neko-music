import { SharedDtos } from '../../shared'

export interface ArtistDto {
  id: string
  name: string
  verified: boolean
  genres: string[]
  artwork: SharedDtos.Dtos.Artwork | null
}

import { ArtistLinkDto } from './artist-link.dto'
import { ImageDto } from './image.dto'

export type ArtistDto = {
  id: string
  name: string
  images: ImageDto[]
  links: ArtistLinkDto[]
}

import { ImageDto } from './image.dto'

export type ArtistDto = {
  id: string
  name: string
  images: ImageDto[]
  bio?: string
}

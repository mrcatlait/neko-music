import { ImageDto } from './image.dto'

export type PlaylistDto = {
  id: string
  name: string
  description: string
  type: string
  images: ImageDto[]
}

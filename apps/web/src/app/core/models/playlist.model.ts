import { Image } from './image.model'

export interface Playlist {
  id: string
  name: string
  description: string
  type: string
  images: Image[]
}

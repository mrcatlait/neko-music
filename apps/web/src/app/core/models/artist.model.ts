import { Image } from './image.model'

export interface Artist {
  id: string
  name: string
  images: Image[]
  bio?: string
}

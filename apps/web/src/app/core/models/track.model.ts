import { Image } from './image.model'

export interface Track {
  id: string
  title: string
  images: Image[]
  artists: Array<{
    id: string
    name: string
    role: string
  }>
  duration: number
  genres: string[]
}

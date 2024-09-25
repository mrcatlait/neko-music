import { ImageDto } from './image.dto'

export interface TrackDto {
  id: string
  title: string
  images: ImageDto[]
  artists: Array<{
    id: string
    name: string
    role: string
  }>
  duration: number
  genres: string[]
}

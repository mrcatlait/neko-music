import { ImageDto } from './image.dto'

import { ArtistRole } from '@core/enums'

export interface TrackDto {
  id: string
  title: string
  images: ImageDto[]
  artists: Array<{
    id: string
    name: string
    role: ArtistRole
  }>
  duration: number
  genres: string[]
}

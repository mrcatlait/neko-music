import { Image } from '@core/models'

export interface Artist {
  id: string
  name: string
  bio?: string
  images: Image[]
}

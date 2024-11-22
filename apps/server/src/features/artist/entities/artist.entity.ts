import { ImageEntity } from '@common/entities'

export interface ArtistEntity {
  id: string
  name: string
  bio?: string
  images: ImageEntity[]
}

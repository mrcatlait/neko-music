import { ImageEntity } from '@modules/shared/entities'

export interface ArtistEntity {
  id: string
  name: string
  bio?: string
  images: ImageEntity[]
}

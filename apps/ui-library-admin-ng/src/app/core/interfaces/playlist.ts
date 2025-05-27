import { Image } from '@neko/ui-shared/interfaces'

export interface Playlist {
  id: string
  name: string
  description: string
  type: string
  images: Image[]
}

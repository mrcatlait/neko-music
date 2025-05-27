import { Image } from '@neko/ui-shared/interfaces'

export interface Artist {
  id: string
  name: string
  images: Image[]
  bio?: string
}

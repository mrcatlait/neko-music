import { ArtworkEntity } from '@/modules/shared/entities'

export interface ArtistEntity {
  id: string
  name: string
  artwork: ArtworkEntity
  verified: boolean
}

export type WithArtists<T> = T & {
  artists: ArtistEntity[]
}

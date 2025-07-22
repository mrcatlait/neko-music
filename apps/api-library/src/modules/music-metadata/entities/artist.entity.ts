import { WithArtwork } from './artwork.entity'

export interface ArtistEntity {
  id: string
  name: string
  verified: boolean
}

export type ArtistWithArtworkEntity = WithArtwork<ArtistEntity>

export type WithArtists<T> = T & {
  artists: ArtistEntity[]
}

export interface ArtistEntity {
  id: string
  name: string
  verified: boolean
}

export type WithArtists<T> = T & {
  artists: ArtistEntity[]
}

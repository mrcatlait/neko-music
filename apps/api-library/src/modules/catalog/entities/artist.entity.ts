import { RecordStatus } from '../enums'

export interface ArtistEntity {
  id: string
  name: string
  verified: boolean
  status: RecordStatus
}

export type WithArtists<T> = T & {
  artists: ArtistEntity[]
}

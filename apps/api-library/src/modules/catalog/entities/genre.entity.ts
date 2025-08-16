import { RecordStatus } from '../enums'

export interface GenreEntity {
  id: string
  name: string
  status: RecordStatus
}

export type WithGenres<T> = T & {
  genres: GenreEntity[]
}

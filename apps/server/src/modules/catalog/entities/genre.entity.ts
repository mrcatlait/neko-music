export interface GenreEntity {
  id: string
  name: string
}

export type WithGenres<T> = T & {
  genres: GenreEntity[]
}

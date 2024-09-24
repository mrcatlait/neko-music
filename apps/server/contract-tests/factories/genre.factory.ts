import { faker } from '@faker-js/faker'

import { GenreEntity } from '@features/track/entities'

export const genreFactory = (): GenreEntity => {
  const genreMock: Omit<GenreEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    name: faker.string.sample(),
    tracks: [],
  }

  const genre = new GenreEntity()
  Object.assign(genre, genreMock)

  return genre
}

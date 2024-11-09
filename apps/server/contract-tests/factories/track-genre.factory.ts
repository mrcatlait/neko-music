import { faker } from '@faker-js/faker'

import { GenreEntity, TrackEntity, TrackGenreEntity } from '@modules/track/entities'

export const trackGenreFactory = (track: TrackEntity, genre: GenreEntity) => {
  const trackGenreMock: Omit<TrackGenreEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    trackId: track.id,
    genreId: genre.id,
  }

  const trackGenre = new TrackGenreEntity()
  Object.assign(trackGenre, trackGenreMock)

  return trackGenre
}

import { faker } from '@faker-js/faker'

import { genreFactory } from './genre.factory'
import { trackArtistFactory } from './track-artist.factory'
import { trackImageFactory } from './track-image.factory'

import { TrackEntity } from '@modules/track/entities'

export const trackFactory = (): TrackEntity => {
  const trackMock: Omit<TrackEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    duration: faker.number.int(),
    title: faker.string.sample(),
    releaseDate: faker.date.past(),
    images: [trackImageFactory()],
    artists: [trackArtistFactory()],
    genres: [genreFactory()],
  }

  const track = new TrackEntity()
  Object.assign(track, trackMock)

  return track
}

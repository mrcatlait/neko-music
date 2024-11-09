import { faker } from '@faker-js/faker'

import { TrackEntity } from '@modules/track/entities'

export const trackFactory = (): TrackEntity => {
  const trackMock: Omit<TrackEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    duration: faker.number.int({ min: 1, max: 10000 }),
    title: faker.string.sample(),
    releaseDate: faker.date.past(),
    images: [],
    artists: [],
    genres: [],
  }

  const track = new TrackEntity()
  Object.assign(track, trackMock)

  return track
}

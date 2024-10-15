import { faker } from '@faker-js/faker'

import { TrackImageEntity, TrackEntity } from '@modules/track/entities'

export const trackImageFactory = (): TrackImageEntity => {
  const trackImageMock: Omit<TrackImageEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    trackId: faker.string.uuid(),
    resolution: faker.string.sample(),
    url: faker.internet.url(),
    track: {} as TrackEntity,
  }

  const trackImage = new TrackImageEntity()
  Object.assign(trackImage, trackImageMock)

  return trackImage
}

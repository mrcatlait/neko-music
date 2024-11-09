import { faker } from '@faker-js/faker'

import { TrackImageEntity, TrackEntity } from '@modules/track/entities'

export const trackImageFactory = (track: TrackEntity): TrackImageEntity => {
  const trackImageMock: Omit<TrackImageEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    trackId: track.id,
    resolution: faker.string.sample(),
    url: faker.internet.url(),
    track,
  }

  const trackImage = new TrackImageEntity()
  Object.assign(trackImage, trackImageMock)

  return trackImage
}

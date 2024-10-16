import { faker } from '@faker-js/faker'

import { artistFactory } from './artist.factory'

import { ArtistRole } from '@modules/artist/constants'
import { TrackArtistEntity, TrackEntity } from '@modules/track/entities'

export const trackArtistFactory = (): TrackArtistEntity => {
  const trackArtistMock: Omit<TrackArtistEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    trackId: faker.string.uuid(),
    artistId: faker.string.uuid(),
    role: ArtistRole.PRIMARY,
    artist: artistFactory(),
    track: {} as TrackEntity,
  }

  const trackArtist = new TrackArtistEntity()
  Object.assign(trackArtist, trackArtistMock)

  return trackArtist
}

import { faker } from '@faker-js/faker'

import { ArtistRole } from '@modules/artist/constants'
import { TrackArtistEntity, TrackEntity } from '@modules/track/entities'
import { ArtistEntity } from '@modules/artist/entities'

export const trackArtistFactory = (track: TrackEntity, artist: ArtistEntity): TrackArtistEntity => {
  const trackArtistMock: Omit<TrackArtistEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    trackId: track.id,
    artistId: artist.id,
    role: ArtistRole.PRIMARY,
    artist,
    track,
  }

  const trackArtist = new TrackArtistEntity()
  Object.assign(trackArtist, trackArtistMock)

  return trackArtist
}

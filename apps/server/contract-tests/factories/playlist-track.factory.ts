import { faker } from '@faker-js/faker'

import { PlaylistEntity, PlaylistTrackEntity } from '@modules/playlist/entities'
import { TrackEntity } from '@modules/track/entities'

export const playlistTrackFactory = (playlist: PlaylistEntity, track: TrackEntity): PlaylistTrackEntity => {
  const playlistTrackMock: Omit<PlaylistTrackEntity, 'dtoClass' | 'toDto'> = {
    id: faker.string.uuid(),
    playlistId: playlist.id,
    trackId: track.id,
  }

  const playlistTrack = new PlaylistTrackEntity()
  Object.assign(playlistTrack, playlistTrackMock)

  return playlistTrack
}

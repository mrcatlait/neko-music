import { faker } from '@faker-js/faker'

import { PlaylistType } from '@modules/playlist/constants'
import { PlaylistEntity } from '@modules/playlist/entities'

export const myPlaylistFactory = (id: string, userId: string): PlaylistEntity => {
  const playlistMock: Omit<PlaylistEntity, 'dtoClass' | 'toDto'> = {
    id,
    name: faker.string.sample(),
    type: PlaylistType.PUBLIC,
    userId,
    tracks: [],
  }

  const playlist = new PlaylistEntity()
  Object.assign(playlist, playlistMock)

  return playlist
}

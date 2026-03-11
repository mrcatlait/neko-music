import { MessageStateHandlers } from '@pact-foundation/pact'

import { genreRepositoryMock } from '../mocks'

export const genreStateHandler: MessageStateHandlers = {
  'a genre statistics exists': async () => {
    genreRepositoryMock.getGenreStatistics?.mockResolvedValue([
      {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Rock',
        totalArtists: 10,
        totalAlbums: 10,
        totalTracks: 10,
      },
    ])

    return Promise.resolve()
  },
}

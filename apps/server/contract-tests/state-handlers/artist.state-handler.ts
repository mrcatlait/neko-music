import { MessageStateHandlers } from '@pact-foundation/pact'

import { artistRepositoryMock, genreRepositoryMock } from '../mocks'

import { PublishingStatus } from '@/modules/backstage/enums'

const UUID_V4 = '123e4567-e89b-12d3-a456-426614174000'

const genreEntity = { id: UUID_V4, name: 'Rock' }

const artistEntity = {
  id: UUID_V4,
  name: 'Test Artist',
  status: PublishingStatus.Draft,
  verified: true,
  catalogArtistId: null,
}

const artistWithGenres = {
  ...artistEntity,
  genres: [UUID_V4],
}

export const artistStateHandler: MessageStateHandlers = {
  'genres exist and no artist with name exists': async () => {
    genreRepositoryMock.findGenresByIds?.mockResolvedValue([genreEntity])

    return Promise.resolve()
  },

  'an artist exists': async () => {
    genreRepositoryMock.findGenresByIds?.mockResolvedValue([genreEntity])

    return Promise.resolve()
  },

  'artist statistics exist': async () => {
    artistRepositoryMock.getArtistStatistics?.mockResolvedValue([
      {
        id: UUID_V4,
        name: 'Test Artist',
        status: PublishingStatus.Draft,
        totalAlbums: 0,
        totalTracks: 0,
      },
    ])

    return Promise.resolve()
  },
}

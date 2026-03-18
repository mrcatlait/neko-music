import { MessageStateHandlers } from '@pact-foundation/pact'

import { genreRepositoryMock } from '../mocks'

const UUID_V4 = '00000000-0000-0000-0000-000000000000'

const genreEntity = {
  id: UUID_V4,
  name: 'Rock',
}

export const genreStateHandler: MessageStateHandlers = {
  'a genre statistics exists': async () => {
    genreRepositoryMock.getGenreStatistics?.mockResolvedValue([
      {
        id: UUID_V4,
        name: 'Rock',
        totalArtists: 10,
        totalAlbums: 10,
        totalTracks: 10,
      },
    ])

    return Promise.resolve()
  },

  'no genre with name exists': async () => {
    genreRepositoryMock.findGenreByName?.mockResolvedValue(undefined)
    genreRepositoryMock.createGenre?.mockResolvedValue(genreEntity)

    return Promise.resolve()
  },

  'genres exist': async () => {
    genreRepositoryMock.findAllGenres?.mockResolvedValue([genreEntity])

    return Promise.resolve()
  },

  'a genre exists': async () => {
    genreRepositoryMock.findGenreById?.mockResolvedValue(genreEntity)
    genreRepositoryMock.findGenreByName?.mockResolvedValue(undefined)
    genreRepositoryMock.updateGenre?.mockResolvedValue({ ...genreEntity, name: 'Pop' })

    return Promise.resolve()
  },
}

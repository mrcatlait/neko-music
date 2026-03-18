import { Matchers } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { provider } from '../provider'
import { PactMatcher } from '../types'
import { ACCESS_TOKEN, injectApi } from '../utils'

import { GenreApi } from '@/modules/backstage/shared/services'

const UUID_V4 = '666ab8f3-408b-427c-a603-9d81e7c74610'

describe('Backstage Genre', () => {
  describe('POST /backstage/genres', () => {
    it('should successfully create a genre', async () => {
      await provider
        .addInteraction()
        .given('no genre with name exists')
        .uponReceiving('a request to create a genre')
        .withRequest('POST', '/backstage/genres', (builder) => {
          builder
            .headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) })
            .jsonBody({ name: 'Rock' } as Contracts.Backstage.Genres.CreationRequest)
        })
        .willRespondWith(201, (builder) => {
          builder.jsonBody({
            id: Matchers.uuid(UUID_V4),
            name: Matchers.string('Rock'),
          } as PactMatcher<Contracts.Backstage.Genres.CreationResponse>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, GenreApi)

          // Act
          const response = await firstValueFrom(api.create({ name: 'Rock' }))

          // Assert
          expect(response.id).toBe(UUID_V4)
          expect(response.name).toBe('Rock')
        })
    })
  })

  describe('GET /backstage/genres', () => {
    it('should successfully get all genres', async () => {
      await provider
        .addInteraction()
        .given('genres exist')
        .uponReceiving('a request to get all genres')
        .withRequest('GET', '/backstage/genres', (builder) => {
          builder.headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) })
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            data: [
              {
                id: Matchers.uuid(UUID_V4),
                name: Matchers.string('Rock'),
              },
            ],
          } as PactMatcher<Contracts.Backstage.Genres.GenresResponse>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, GenreApi)

          // Act
          const response = await firstValueFrom(api.getGenres())

          // Assert
          expect(response.data).toEqual([
            {
              id: UUID_V4,
              name: 'Rock',
            },
          ])
        })
    })
  })

  describe('GET /backstage/genres/:id', () => {
    it('should successfully get a genre', async () => {
      await provider
        .addInteraction()
        .given('a genre exists')
        .uponReceiving('a request to get a genre')
        .withRequest('GET', `/backstage/genres/${UUID_V4}`, (builder) => {
          builder.headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) })
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            id: Matchers.uuid(UUID_V4),
            name: Matchers.string('Rock'),
          } as PactMatcher<Contracts.Backstage.Genres.Genre>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, GenreApi)

          // Act
          const response = await firstValueFrom(api.getGenre(UUID_V4))

          // Assert
          expect(response.id).toBe(UUID_V4)
          expect(response.name).toBe('Rock')
        })
    })
  })

  describe('PUT /backstage/genres/:id', () => {
    it('should successfully update a genre', async () => {
      await provider
        .addInteraction()
        .given('a genre exists')
        .uponReceiving('a request to update a genre')
        .withRequest('PUT', `/backstage/genres/${UUID_V4}`, (builder) => {
          builder
            .headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) })
            .jsonBody({ name: 'Pop' } as Contracts.Backstage.Genres.UpdateRequest)
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            id: Matchers.uuid(UUID_V4),
            name: Matchers.string('Pop'),
          } as PactMatcher<Contracts.Backstage.Genres.Genre>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, GenreApi)

          // Act
          const response = await firstValueFrom(api.updateGenre(UUID_V4, { name: 'Pop' }))

          // Assert
          expect(response.id).toBe(UUID_V4)
          expect(response.name).toBe('Pop')
        })
    })
  })

  describe('GET /backstage/genres/statistics', () => {
    it('should successfully get genre statistics', async () => {
      await provider
        .addInteraction()
        .given('a genre statistics exists')
        .uponReceiving('a request to get genre statistics')
        .withRequest('GET', '/backstage/genres/statistics', (builder) => {
          builder.headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) })
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            data: [
              {
                id: Matchers.uuid(UUID_V4),
                name: Matchers.string('Rock'),
                totalArtists: Matchers.number(10),
                totalAlbums: Matchers.number(10),
                totalTracks: Matchers.number(10),
              },
            ],
          } as PactMatcher<Contracts.Backstage.Genres.StatisticsResponse>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, GenreApi)

          // Act
          const response = await firstValueFrom(api.getStatistics())

          // Assert
          expect(response.data).toEqual([
            {
              id: UUID_V4,
              name: 'Rock',
              totalArtists: 10,
              totalAlbums: 10,
              totalTracks: 10,
            },
          ])
        })
    })
  })
})

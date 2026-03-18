import { Matchers } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { provider } from '../provider'
import { PactMatcher } from '../types'
import { ACCESS_TOKEN, injectApi } from '../utils'

import { ArtistApi } from '@/modules/backstage/artist/artist-api'

const UUID_V4 = '666ab8f3-408b-427c-a603-9d81e7c74610'
const UPLOAD_TOKEN = 'test-upload-token'

describe('Backstage Artist', () => {
  describe('POST /backstage/artists', () => {
    it('should successfully create an artist', async () => {
      await provider
        .addInteraction()
        .given('genres exist and no artist with name exists')
        .uponReceiving('a request to create an artist')
        .withRequest('POST', '/backstage/artists', (builder) => {
          builder.headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) }).jsonBody({
            name: 'Test Artist',
            genres: [UUID_V4],
            verified: true,
          } as Contracts.Backstage.Artists.CreationRequest)
        })
        .willRespondWith(201, (builder) => {
          builder.jsonBody({
            artistId: Matchers.uuid(UUID_V4),
            uploadToken: Matchers.string(UPLOAD_TOKEN),
          } as PactMatcher<Contracts.Backstage.Artists.CreationResponse>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, ArtistApi)

          // Act
          const response = await firstValueFrom(
            api.create({
              name: 'Test Artist',
              genres: [UUID_V4],
              verified: true,
            }),
          )

          // Assert
          expect(response.artistId).toBe(UUID_V4)
          expect(response.uploadToken).toBe(UPLOAD_TOKEN)
        })
    })
  })

  describe('GET /backstage/artists/:id', () => {
    it('should successfully get an artist', async () => {
      await provider
        .addInteraction()
        .given('an artist exists')
        .uponReceiving('a request to get an artist')
        .withRequest('GET', `/backstage/artists/${UUID_V4}`, (builder) => {
          builder.headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) })
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            id: Matchers.uuid(UUID_V4),
            name: Matchers.string('Test Artist'),
            verified: Matchers.boolean(true),
            genres: [Matchers.uuid(UUID_V4)],
            artwork: null,
          } as PactMatcher<Contracts.Backstage.Artists.Artist>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, ArtistApi)

          // Act
          const response = await firstValueFrom(api.getArtist(UUID_V4))

          // Assert
          expect(response.id).toBe(UUID_V4)
          expect(response.name).toBe('Test Artist')
          expect(response.verified).toBe(true)
          expect(response.genres).toEqual([UUID_V4])
          expect(response.artwork).toBeNull()
        })
    })
  })

  describe('PUT /backstage/artists/:id', () => {
    it('should successfully update an artist', async () => {
      await provider
        .addInteraction()
        .given('an artist exists')
        .uponReceiving('a request to update an artist')
        .withRequest('PUT', `/backstage/artists/${UUID_V4}`, (builder) => {
          builder.headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) }).jsonBody({
            name: 'Updated Artist',
            genres: [UUID_V4],
            verified: true,
          } as Contracts.Backstage.Artists.UpdateRequest)
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            uploadToken: Matchers.string(UPLOAD_TOKEN),
          } as PactMatcher<Contracts.Backstage.Artists.UpdateResponse>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, ArtistApi)

          // Act
          const response = await firstValueFrom(
            api.updateArtist(UUID_V4, {
              name: 'Updated Artist',
              genres: [UUID_V4],
              verified: true,
            }),
          )

          // Assert
          expect(response.uploadToken).toBe(UPLOAD_TOKEN)
        })
    })
  })

  describe('GET /backstage/artists/statistics', () => {
    it('should successfully get artist statistics', async () => {
      await provider
        .addInteraction()
        .given('artist statistics exist')
        .uponReceiving('a request to get artist statistics')
        .withRequest('GET', '/backstage/artists/statistics', (builder) => {
          builder.headers({ Authorization: Matchers.like(`Bearer ${ACCESS_TOKEN}`) })
        })
        .willRespondWith(200, (builder) => {
          builder.jsonBody({
            data: [
              {
                id: Matchers.uuid(UUID_V4),
                name: Matchers.string('Test Artist'),
                status: Matchers.string('draft'),
                totalAlbums: Matchers.number(0),
                totalTracks: Matchers.number(0),
              },
            ],
          } as PactMatcher<Contracts.Backstage.Artists.StatisticsResponse>)
        })
        .executeTest(async (mockServer) => {
          // Arrange
          const api = injectApi(mockServer, ArtistApi)

          // Act
          const response = await firstValueFrom(api.getStatistics())

          // Assert
          expect(response.data).toEqual([
            {
              id: UUID_V4,
              name: 'Test Artist',
              status: 'draft',
              totalAlbums: 0,
              totalTracks: 0,
            },
          ])
        })
    })
  })
})

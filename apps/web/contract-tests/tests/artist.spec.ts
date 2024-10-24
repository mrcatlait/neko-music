import { PactV4 } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { resolve } from 'path'

import { ArtistRepository } from '@core/repositories'
import {
  getArtistSuccess,
  getArtistSuccessResponseBody,
  getArtistTracksSuccess,
  getTracksSuccessResponseBody,
} from 'contract-tests/fixtures'
import { repositoryProvider } from 'contract-tests/utils'

describe('Tracks', () => {
  const provider = new PactV4({
    logLevel: 'info',
    consumer: 'web',
    provider: 'music-library-api',
    dir: resolve(process.cwd(), '..', '..', 'contracts'),
  })

  describe('GET /artist/{id}', () => {
    it('returns an HTTP 200 and an artist details', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('artist exists')
        .uponReceiving('a request to GET artist')
        .withRequest('GET', '/artists/c76b4326-ca77-4c24-a414-f002c6be3106')
        .willRespondWith(200, (builder) => builder.jsonBody(getArtistSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(ArtistRepository, mockServer)
          await firstValueFrom(repository.getById('c76b4326-ca77-4c24-a414-f002c6be3106')).then((response) => {
            expect(response).toEqual(getArtistSuccess)
          })
        })
    })
  })

  describe('GET /artist/{id}/tracks', () => {
    const take = 50
    const offset = 0

    it('returns an HTTP 200 and a list of artist tracks', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('artist exists')
        .given('list of tracks exists')
        .uponReceiving('a request to GET artist tracks')
        .withRequest('GET', '/artists/c76b4326-ca77-4c24-a414-f002c6be3106/tracks', (builder) => {
          builder.query({ take: '50', offset: '0' })
        })
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(ArtistRepository, mockServer)
          await firstValueFrom(repository.getTracksById('c76b4326-ca77-4c24-a414-f002c6be3106', { offset, take })).then(
            (response) => {
              expect(response).toEqual(getArtistTracksSuccess)
            },
          )
        })
    })
  })
})

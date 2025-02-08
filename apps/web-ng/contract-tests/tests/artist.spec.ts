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
      const id = 'c76b4326-ca77-4c24-a414-f002c6be3106'

      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has artist', { id })
        .uponReceiving('a request to GET artist')
        .withRequest('GET', `/artists/${id}`)
        .willRespondWith(200, (builder) => builder.jsonBody(getArtistSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(ArtistRepository, mockServer)
          await firstValueFrom(repository.getById(id)).then((response) => {
            expect(response).toEqual(getArtistSuccess)
          })
        })
    })
  })

  describe('GET /artist/{id}/tracks', () => {
    const take = 50
    const offset = 0

    it('returns an HTTP 200 and a list of artist tracks', async () => {
      const id = 'c76b4326-ca77-4c24-a414-f002c6be3106'

      await provider
        .addInteraction()
        .given('authenticated user')
        .given('has artist', { id })
        .given('has artist tracks', { id })
        .uponReceiving('a request to GET artist tracks')
        .withRequest('GET', `/artists/${id}/tracks`, (builder) => {
          builder.query({ take: String(take), offset: String(offset) })
        })
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(ArtistRepository, mockServer)
          await firstValueFrom(repository.getTracksById(id, { offset, take })).then((response) => {
            expect(response).toEqual(getArtistTracksSuccess)
          })
        })
    })
  })
})

import { PactV4 } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { resolve } from 'path'

import { TrackRepository } from '@core/repositories'
import {
  getTracksEmpty,
  getTracksEmptyResponseBody,
  getTracksSuccess,
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

  describe('GET /tracks', () => {
    const take = 50
    const offset = 0

    it('returns an HTTP 200 and a list of tracks', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('list of tracks exists')
        .uponReceiving('a request to GET tracks')
        .withRequest('GET', '/tracks', (builder) => builder.query({ take: '50', offset: '0' }))
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(TrackRepository, mockServer)

          await firstValueFrom(repository.get({ take, offset })).then((response) => {
            expect(response).toEqual(getTracksSuccess)
          })
        })
    })

    it('returns an HTTP 200 and an empty list of tracks', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('list of tracks is empty')
        .uponReceiving('a request to GET tracks')
        .withRequest('GET', '/tracks', (builder) => builder.query({ take: '50', offset: '0' }))
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksEmptyResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(TrackRepository, mockServer)

          await firstValueFrom(repository.get({ take, offset })).then((response) => {
            expect(response).toEqual(getTracksEmpty)
          })
        })
    })
  })

  describe('GET /tracks/new', () => {
    it('returns an HTTP 200 and a list of tracks', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('list of tracks exists')
        .uponReceiving('a request to GET new tracks')
        .withRequest('GET', '/tracks/new', (builder) => builder.query({ take: '6', offset: '0' }))
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(TrackRepository, mockServer)

          await firstValueFrom(repository.getNew()).then((response) => {
            expect(response).toEqual(getTracksSuccess)
          })
        })
    })

    it('returns an HTTP 200 and an empty list of tracks', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('list of tracks is empty')
        .uponReceiving('a request to GET new tracks')
        .withRequest('GET', '/tracks/new', (builder) => builder.query({ take: '6', offset: '0' }))
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksEmptyResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(TrackRepository, mockServer)

          await firstValueFrom(repository.getNew()).then((response) => {
            expect(response).toEqual(getTracksEmpty)
          })
        })
    })
  })

  describe('GET /tracks/popular', () => {
    it('returns an HTTP 200 and a list of tracks', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('list of tracks exists')
        .uponReceiving('a request to GET popular tracks')
        .withRequest('GET', '/tracks/popular', (builder) => builder.query({ take: '12', offset: '0' }))
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksSuccessResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(TrackRepository, mockServer)

          await firstValueFrom(repository.getPopular()).then((response) => {
            expect(response).toEqual(getTracksSuccess)
          })
        })
    })

    it('returns an HTTP 200 and an empty list of tracks', async () => {
      await provider
        .addInteraction()
        .given('authenticated user')
        .given('list of tracks is empty')
        .uponReceiving('a request to GET popular tracks')
        .withRequest('GET', '/tracks/popular', (builder) => builder.query({ take: '12', offset: '0' }))
        .willRespondWith(200, (builder) => builder.jsonBody(getTracksEmptyResponseBody))
        .executeTest(async (mockServer) => {
          const repository = repositoryProvider(TrackRepository, mockServer)

          await firstValueFrom(repository.getPopular()).then((response) => {
            expect(response).toEqual(getTracksEmpty)
          })
        })
    })
  })
})

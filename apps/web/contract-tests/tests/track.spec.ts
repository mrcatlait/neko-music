import { TestBed } from '@angular/core/testing'
import { Pact } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { provideHttpClient } from '@angular/common/http'
import { resolve } from 'path'

import { API_URL } from '@core/tokens'
import { TrackRepository } from '@core/repositories'
import { getTracksEmpty, getTracksSuccess, requestToGetTracks, trackResponses } from 'contract-tests/fixtures'

describe('Tracks', () => {
  let repository: TrackRepository

  const provider = new Pact({
    logLevel: 'info',
    consumer: 'web',
    provider: 'music-library-api',
    dir: resolve(process.cwd(), '..', '..', 'contracts'),
  })

  beforeAll(async () => {
    await provider.setup()
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackRepository, provideHttpClient(), { provide: API_URL, useValue: provider.mockService.baseUrl }],
    })

    repository = TestBed.inject(TrackRepository)
  })

  afterEach(async () => {
    await provider.verify()
  })

  afterAll(async () => {
    await provider.finalize()
  })

  describe('GET /tracks', () => {
    const take = 50
    const offset = 0

    it('returns an HTTP 200 and a list of tracks', async () => {
      await provider.addInteraction({
        ...requestToGetTracks,
        state: 'list of tracks exists',
        ...trackResponses.getTracksSuccess,
      })

      await firstValueFrom(repository.get({ take, offset })).then((response) => {
        expect(response).toEqual(getTracksSuccess)
      })
    })

    it('returns an HTTP 200 and an empty list of tracks', async () => {
      await provider.addInteraction({
        ...requestToGetTracks,
        state: 'list of tracks is empty',
        ...trackResponses.getTracksEmpty,
      })

      await firstValueFrom(repository.get({ take, offset })).then((response) => {
        expect(response).toEqual(getTracksEmpty)
      })
    })
  })
})

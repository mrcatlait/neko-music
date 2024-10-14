import { TestBed } from '@angular/core/testing'
import { Pact } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { provideHttpClient } from '@angular/common/http'
import { resolve } from 'path'

import { API_URL } from '@core/tokens'
import { ArtistRepository } from '@core/repositories'
import {
  artistResponses,
  getArtistSuccess,
  getArtistTracksSuccess,
  requestToGetArtist,
  requestToGetArtistTracks,
} from 'contract-tests/fixtures'

describe('Tracks', () => {
  let repository: ArtistRepository

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
      providers: [ArtistRepository, provideHttpClient(), { provide: API_URL, useValue: provider.mockService.baseUrl }],
    })

    repository = TestBed.inject(ArtistRepository)
  })

  afterEach(async () => {
    await provider.verify()
    vi.resetAllMocks()
  })

  afterAll(async () => {
    await provider.finalize()
  })

  describe('GET /artist/{id}', () => {
    it('returns an HTTP 200 and an artist details', async () => {
      await provider.addInteraction({
        ...requestToGetArtist,
        state: 'artist exists',
        ...artistResponses.getArtistSuccess,
      })

      await firstValueFrom(repository.getById('c76b4326-ca77-4c24-a414-f002c6be3106')).then((response) => {
        expect(response).toEqual(getArtistSuccess)
      })
    })
  })

  describe('GET /artist/{id}/tracks', () => {
    const take = 50
    const offset = 0

    it('returns an HTTP 200 and a list of artist tracks', async () => {
      await provider.addInteraction({
        ...requestToGetArtistTracks,
        state: 'artist exists and list of tracks exists',
        ...artistResponses.getArtistTracksSuccess,
      })

      await firstValueFrom(repository.getTracksById('c76b4326-ca77-4c24-a414-f002c6be3106', { offset, take })).then(
        (response) => {
          expect(response).toEqual(getArtistTracksSuccess)
        },
      )
    })
  })
})

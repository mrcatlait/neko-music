import { Matchers } from '@pact-foundation/pact'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { provider } from '../provider'
import { PactMatcher } from '../types'
import { ACCESS_TOKEN, injectApi } from '../utils'

import { GenreApi } from '@/modules/backstage/shared/services'

describe('Backstage Genre', () => {
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
                id: Matchers.uuid('00000000-0000-0000-0000-000000000000'),
                name: Matchers.string('Rock'),
                totalArtists: Matchers.number(10),
                totalAlbums: Matchers.number(10),
                totalTracks: Matchers.number(10),
              },
            ],
          } as PactMatcher<Contracts.Backstage.GenreStatisticsResponse>)
        })
        .executeTest(async (mockServer) => {
          const api = injectApi(mockServer, GenreApi)
          const response = await firstValueFrom(api.getStatistics())
          expect(response.data).toEqual([
            {
              id: '00000000-0000-0000-0000-000000000000',
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

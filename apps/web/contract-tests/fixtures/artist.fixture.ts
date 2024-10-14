import { InteractionObject, MatchersV3 } from '@pact-foundation/pact'

import { getTracksSuccess, getTracksSuccessResponseBody } from './track.fixture'

import { ArtistDto } from '@core/dto'
import { PactMatcher, PactResponseOptions } from 'contract-tests/types'
import { mapArtistDtoToModel } from '@core/mappers'

const { extractPayload, string, uuid } = MatchersV3

const artistDto: PactMatcher<ArtistDto> = {
  id: uuid('c76b4326-ca77-4c24-a414-f002c6be3106'),
  name: string('Name'),
  bio: string('Bio'),
  images: [
    {
      resolution: string(),
      url: string(),
    },
  ],
}

const getArtistSuccessResponseBody: PactMatcher<ArtistDto> = artistDto
export const getArtistSuccess = mapArtistDtoToModel(
  extractPayload(getArtistSuccessResponseBody) as unknown as ArtistDto,
)

export const getArtistTracksSuccess = getTracksSuccess

export const artistResponses = {
  getArtistSuccess: {
    willRespondWith: {
      status: 200,
      body: getArtistSuccessResponseBody,
    } as PactResponseOptions,
  },
  getArtistTracksSuccess: {
    willRespondWith: {
      status: 200,
      body: getTracksSuccessResponseBody,
    } as PactResponseOptions,
  },
}

export const requestToGetArtist: Pick<InteractionObject, 'uponReceiving' | 'withRequest'> = {
  uponReceiving: 'a request to GET artist',
  withRequest: {
    method: 'GET',
    path: '/artists/c76b4326-ca77-4c24-a414-f002c6be3106',
  },
}

export const requestToGetArtistTracks: Pick<InteractionObject, 'uponReceiving' | 'withRequest'> = {
  uponReceiving: 'a request to GET artist tracks',
  withRequest: {
    method: 'GET',
    path: '/artists/c76b4326-ca77-4c24-a414-f002c6be3106/tracks',
    query: {
      take: '50',
      offset: '0',
    },
  },
}

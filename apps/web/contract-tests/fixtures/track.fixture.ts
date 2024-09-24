import { InteractionObject, MatchersV3 } from '@pact-foundation/pact'

import { PageResponseDto, TrackDto } from '@core/dto'
import { PactMatcher, PactResponses } from 'contract-tests/types'

const { extractPayload, integer, string, uuid } = MatchersV3

const track: PactMatcher<TrackDto> = {
  id: uuid('c76b4326-ca77-4c24-a414-f002c6be3106'),
  title: string('Title'),
  duration: integer(123),
  genres: [string('Rock')],
  images: [
    {
      resolution: string(),
      url: string(),
    },
  ],
  artists: [
    {
      id: uuid('c76b4326-ca77-4c24-a414-f002c6be3106'),
      name: string('Artist'),
    },
  ],
}

const getTracksSuccessResponseBody: PactMatcher<PageResponseDto<TrackDto>> = {
  data: [track],
  meta: {
    take: integer(50),
    offset: integer(0),
    itemCount: integer(1),
    pageCount: integer(1),
  },
}
export const getTracksSuccess = extractPayload(getTracksSuccessResponseBody)

const getTracksEmptyResponseBody: PactMatcher<PageResponseDto<TrackDto>> = {
  data: [],
  meta: {
    take: integer(50),
    offset: integer(0),
    itemCount: integer(0),
    pageCount: integer(1),
  },
}
export const getTracksEmpty = extractPayload(getTracksEmptyResponseBody)

export const trackResponses: PactResponses = {
  getTracksSuccess: {
    willRespondWith: {
      status: 200,
      body: getTracksSuccessResponseBody,
    },
  },
  getTracksEmpty: {
    willRespondWith: {
      status: 200,
      body: getTracksEmptyResponseBody,
    },
  },
}

export const requestToGetTracks: Pick<InteractionObject, 'uponReceiving' | 'withRequest'> = {
  uponReceiving: 'a request to GET tracks',
  withRequest: {
    method: 'GET',
    path: '/tracks',
    query: {
      take: '50',
      offset: '0',
    },
  },
}

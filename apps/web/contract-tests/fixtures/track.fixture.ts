import { Matcher, MatchersV3 } from '@pact-foundation/pact'

import { PageResponseDto, TrackDto } from '@core/dto'
import { PactMatcher } from 'contract-tests/types'
import { mapTrackDtoToModel } from '@core/mappers'
import { ArtistRole } from '@core/enum'

const { extractPayload, integer, string, uuid } = MatchersV3

const trackDto: PactMatcher<TrackDto> = {
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
      role: string(ArtistRole.Primary) as Matcher<ArtistRole>,
    },
  ],
}

export const getTracksSuccessResponseBody: PactMatcher<PageResponseDto<TrackDto>> = {
  data: [trackDto],
  meta: {
    take: integer(50),
    offset: integer(0),
    itemCount: integer(1),
    pageCount: integer(1),
  },
}
export const getTracksSuccess = (extractPayload(getTracksSuccessResponseBody.data) as unknown as TrackDto[]).map(
  mapTrackDtoToModel,
)

export const getTracksEmptyResponseBody: PactMatcher<PageResponseDto<TrackDto>> = {
  data: [],
  meta: {
    take: integer(50),
    offset: integer(0),
    itemCount: integer(0),
    pageCount: integer(1),
  },
}

export const getTracksEmpty = extractPayload(getTracksEmptyResponseBody.data)

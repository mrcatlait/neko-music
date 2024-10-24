import { MatchersV3 } from '@pact-foundation/pact'

import { getTracksSuccess } from './track.fixture'

import { ArtistDto } from '@core/dto'
import { PactMatcher } from 'contract-tests/types'
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

export const getArtistSuccessResponseBody: PactMatcher<ArtistDto> = artistDto
export const getArtistSuccess = mapArtistDtoToModel(
  extractPayload(getArtistSuccessResponseBody) as unknown as ArtistDto,
)

export const getArtistTracksSuccess = getTracksSuccess

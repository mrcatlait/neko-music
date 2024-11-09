import { MatchersV3 } from '@pact-foundation/pact'
import { AnyTemplate } from '@pact-foundation/pact/src/dsl/matchers'

import { trackDto } from './track.fixture'

import {
  AddPlaylistTrackDto,
  CreatePlaylistDto,
  PageResponseDto,
  PlaylistDto,
  RemovePlaylistTrackDto,
  TrackDto,
  UpdatePlaylistDto,
  UpdatePlaylistTracksDto,
} from '@core/dto'
import { PactMatcher } from 'contract-tests/types'

const { extractPayload, eachLike, integer, boolean, string, uuid } = MatchersV3

export const createPlaylistRequestBody: PactMatcher<CreatePlaylistDto> = {
  name: string('Name'),
  description: string('Description'),
  isPublic: boolean(true),
}
export const createPlaylistDto = extractPayload(createPlaylistRequestBody) as CreatePlaylistDto

const playlistDto: PactMatcher<PlaylistDto> = {
  id: string('ID'),
  name: string('Name'),
  description: string('Description'),
  isPublic: boolean(true),
  tracks: eachLike(trackDto) as unknown as TrackDto[],
}

export const getPlaylistSuccessResponseBody = playlistDto
export const getPlaylistSuccess = extractPayload(
  getPlaylistSuccessResponseBody as AnyTemplate,
) as unknown as PlaylistDto

export const updatePlaylistRequestBody: PactMatcher<UpdatePlaylistDto> = {
  name: string('Name'),
  description: string('Description'),
  isPublic: boolean(true),
}
export const updatePlaylistDto = extractPayload(updatePlaylistRequestBody) as UpdatePlaylistDto

export const getMyPlaylistsSuccessResponseBody: PactMatcher<PageResponseDto<PlaylistDto>> = {
  data: [playlistDto],
  meta: {
    take: integer(50),
    offset: integer(0),
    itemCount: integer(1),
    pageCount: integer(1),
  },
}
export const getMyPlaylistsSuccess = extractPayload(
  getMyPlaylistsSuccessResponseBody as AnyTemplate,
) as unknown as PlaylistDto[]

export const addPlaylistTrackRequestBody: PactMatcher<AddPlaylistTrackDto> = {
  tracks: [uuid()],
}
export const addPlaylistTrackDto = extractPayload(addPlaylistTrackRequestBody) as AddPlaylistTrackDto

export const updatePlaylistTracksRequestBody: PactMatcher<UpdatePlaylistTracksDto> = {
  rangeStart: integer(0),
  rangeEnd: integer(1),
  insertBefore: integer(0),
}
export const updatePlaylistTracksDto = extractPayload(updatePlaylistTracksRequestBody) as UpdatePlaylistTracksDto

export const removePlaylistTrackRequestBody: PactMatcher<RemovePlaylistTrackDto> = {
  tracks: [uuid()],
}
export const removePlaylistTrackDto = extractPayload(removePlaylistTrackRequestBody) as RemovePlaylistTrackDto

import { CreationRequestDto } from './creation-request.dto'
import { CreationResponseDto } from './creation-response.dto'
import { StatisticsResponseDto } from './statistics-response.dto'
import { StatisticsDto } from './statistics.dto'
import { UpdateRequestDto } from './update-request.dto'
import { ArtistDto } from './artist.dto'
import { ArtistsResponseDto } from './artists-response.dto'
import { UpdateResponseDto } from './update-response.dto'

export namespace ArtistsDtos {
  export type CreationRequest = CreationRequestDto
  export type CreationResponse = CreationResponseDto
  export type Statistics = StatisticsDto
  export type StatisticsResponse = StatisticsResponseDto
  export type UpdateRequest = UpdateRequestDto
  export type UpdateResponse = UpdateResponseDto
  export type ArtistsResponse = ArtistsResponseDto
  export type Artist = ArtistDto
}

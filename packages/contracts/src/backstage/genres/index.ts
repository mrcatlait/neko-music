import { CreationRequestDto } from './creation-request.dto'
import { CreationResponseDto } from './creation-response.dto'
import { GenreDto } from './genre.dto'
import { GenresResponseDto } from './genres-response.dto'
import { StatisticsResponseDto } from './statistics-response.dto'
import { StatisticsDto } from './statistics.dto'
import { UpdateRequestDto } from './update-request.dto'

export namespace GenresDtos {
  export type CreationRequest = CreationRequestDto
  export type CreationResponse = CreationResponseDto
  export type StatisticsResponse = StatisticsResponseDto
  export type Statistics = StatisticsDto
  export type UpdateRequest = UpdateRequestDto
  export type Genre = GenreDto
  export type GenresResponse = GenresResponseDto
}

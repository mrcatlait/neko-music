import { SharedDtos } from '../../shared'
import { TrackTypeEnum } from '../../shared/track-type.enum'

export interface CreationRequestDto {
  name: string
  releaseDate: string
  diskNumber: number
  trackNumber: number
  type: TrackTypeEnum
  explicit: boolean
  genres: string[]
  artists: SharedDtos.Dtos.ArtistRole[]
}

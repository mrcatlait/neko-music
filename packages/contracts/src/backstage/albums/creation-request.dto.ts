import { SharedDtos } from '../../shared'
import { TracksDtos } from '../tracks'

export interface CreationRequestDto {
  name: string
  releaseDate: string
  type: SharedDtos.Enums.AlbumType
  explicit: boolean
  genres: string[]
  artists: SharedDtos.Dtos.ArtistRole[]
  tracks: TracksDtos.CreationRequest[]
}

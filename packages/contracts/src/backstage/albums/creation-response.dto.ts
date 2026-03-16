import { TracksDtos } from '../tracks'

export interface CreationResponseDto {
  id: string
  uploadToken: string
  tracks: TracksDtos.CreationResponse[]
}

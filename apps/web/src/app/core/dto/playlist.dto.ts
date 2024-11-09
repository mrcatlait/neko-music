import { TrackDto } from './track.dto'

export type PlaylistDto = {
  id: string
  name: string
  description: string
  isPublic: boolean
  tracks: TrackDto[]
}

import { Track } from '@core/models'

export interface LinkedTrack extends Track {
  linkedTrackId: string
}

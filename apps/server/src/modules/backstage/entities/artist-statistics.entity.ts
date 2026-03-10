import { PublishingStatus } from '../enums'

export class ArtistStatisticsEntity {
  id: string
  name: string
  status: PublishingStatus
  totalAlbums: number
  totalTracks: number
}

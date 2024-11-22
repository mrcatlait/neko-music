import { PageOptionsDto } from '@common/dto'

export interface GetPlaylistTracksQuery {
  userId: string
  playlistId: string
  pageOptionsDto: PageOptionsDto
}

import { PageOptionsDto } from '@common/dto'

export interface GetUserPlaylistsQuery {
  userId: string
  pageOptionsDto: PageOptionsDto
}

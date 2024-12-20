import { PageOptionsDto } from '@modules/shared/dtos'

export interface GetUserPlaylistsQuery {
  userId: string
  pageOptionsDto: PageOptionsDto
}

import { PageOptionsDto } from '@common/dto'

export interface GetArtistTracksQuery {
  artistId: string
  pageOptionsDto: PageOptionsDto
}

import { PageOptionsDto } from '@common/dto'
import { sql } from 'src/db'

export class TrackArtistRepository {
  getItemIds(artistId: string, pageOptionsDto: PageOptionsDto): Promise<string[]> {
    return sql<{ track_id: string }[]>`
      SELECT track_id
      FROM "TrackArtist"
      WHERE artist_id = ${artistId}
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `.then((result) => result.map((item) => item.track_id))
  }

  getItemIdsFull(artistId: string): Promise<string[]> {
    return sql<{ track_id: string }[]>`
      SELECT track_id
      FROM "TrackArtist"
      WHERE artist_id = ${artistId}
    `.then((result) => result.map((item) => item.track_id))
  }
}

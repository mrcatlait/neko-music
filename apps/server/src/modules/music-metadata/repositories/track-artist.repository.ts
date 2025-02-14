import { Injectable } from '@nestjs/common'

import { DatabaseService } from '@modules/database'
import { PageOptionsDto } from '@modules/shared/dtos'

@Injectable()
export class TrackArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  getItemIds(artistId: string, pageOptionsDto: PageOptionsDto): Promise<string[]> {
    return this.databaseService.sql<{ track_id: string }[]>`
      SELECT track_id
      FROM "TrackArtist"
      WHERE artist_id = ${artistId}
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `.then((result) => result.map((item) => item.track_id))
  }

  getItemIdsFull(artistId: string): Promise<string[]> {
    return this.databaseService.sql<{ track_id: string }[]>`
      SELECT track_id
      FROM "TrackArtist"
      WHERE artist_id = ${artistId}
    `.then((result) => result.map((item) => item.track_id))
  }
}

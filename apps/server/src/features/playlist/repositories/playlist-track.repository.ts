import { PlaylistTrackEntity } from '../entities'

import { PageOptionsDto } from '@common/dto'
import { sql } from 'src/db'

export class PlaylistTrackRepository {
  getMaxPosition(playlistId: string): Promise<number> {
    return sql<{ max_position: number }[]>`
      SELECT MAX("position") as "max_position"
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
    `.then((result) => result.at(0)?.max_position ?? 0)
  }

  getItemIds(playlistId: string, pageOptionsDto: PageOptionsDto): Promise<string[]> {
    return sql<{ track_id: string }[]>`
      SELECT "track_id"
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
      ORDER BY "position" ASC
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `.then((result) => result.map((item) => item.track_id))
  }

  getItemIdsFull(playlistId: string): Promise<string[]> {
    return sql<{ track_id: string; position: number }[]>`
      SELECT "track_id", "position"
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
      ORDER BY "position" ASC
    `.then((result) => result.map((item) => item.track_id))
  }

  getItems(playlistId: string): Promise<PlaylistTrackEntity[]> {
    return sql<PlaylistTrackEntity[]>`
      SELECT *
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
      ORDER BY "position" ASC
    `
  }

  saveItems(playlistTracks: PlaylistTrackEntity[]): Promise<void> {
    return sql`
      INSERT INTO "PlaylistTrack" ${sql(playlistTracks)}
    `.then()
  }

  delete(playlistId: string, trackId: string): Promise<void> {
    return sql`
      DELETE FROM "PlaylistTrack" WHERE "playlist_id" = ${playlistId} AND "track_id" = ${trackId}
    `.then()
  }

  updateTrackPositions(updates: { track_id: string; position: number }[]): Promise<void> {
    return sql`
      UPDATE "PlaylistTrack" SET ${sql(updates)}
    `.then()
  }
}

import { PlaylistTrackEntity } from '../entities'

import { DatabaseService } from '@common/database'
import { PageOptionsDto } from '@common/dtos'
import { Container } from '@common/di'

export class PlaylistTrackRepository {
  private readonly databaseService: DatabaseService

  constructor() {
    this.databaseService = Container.get(DatabaseService)
  }

  getMaxPosition(playlistId: string): Promise<number> {
    return this.databaseService.sql<{ max_position: number }[]>`
      SELECT MAX("position") as "max_position"
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
    `.then((result) => result.at(0)?.max_position ?? 0)
  }

  getItemIds(playlistId: string, pageOptionsDto: PageOptionsDto): Promise<string[]> {
    return this.databaseService.sql<{ track_id: string }[]>`
      SELECT "track_id"
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
      ORDER BY "position" ASC
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `.then((result) => result.map((item) => item.track_id))
  }

  getItemIdsFull(playlistId: string): Promise<string[]> {
    return this.databaseService.sql<{ track_id: string; position: number }[]>`
      SELECT "track_id", "position"
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
      ORDER BY "position" ASC
    `.then((result) => result.map((item) => item.track_id))
  }

  getItems(playlistId: string): Promise<PlaylistTrackEntity[]> {
    return this.databaseService.sql<PlaylistTrackEntity[]>`
      SELECT *
      FROM "PlaylistTrack"
      WHERE "playlist_id" = ${playlistId}
      ORDER BY "position" ASC
    `
  }

  saveItems(playlistTracks: PlaylistTrackEntity[]): Promise<void> {
    return this.databaseService.sql`
      INSERT INTO "PlaylistTrack" ${this.databaseService.sql(playlistTracks)}
    `.then()
  }

  delete(playlistId: string, trackId: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "PlaylistTrack" WHERE "playlist_id" = ${playlistId} AND "track_id" = ${trackId}
    `.then()
  }

  updateTrackPositions(updates: { track_id: string; position: number }[]): Promise<void> {
    return this.databaseService.sql`
      UPDATE "PlaylistTrack" SET ${this.databaseService.sql(updates)}
    `.then()
  }
}

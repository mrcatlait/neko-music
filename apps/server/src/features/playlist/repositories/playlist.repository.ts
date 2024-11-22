import { PlaylistEntity, PlaylistWithTrackIdsEntity } from '../entities'

import { PageOptionsDto } from '@common/dto'
import { PaginationMapper } from '@core/mappers'
import { Pagination } from '@core/models'
import { sql } from 'src/db'

export class PlaylistRepository {
  checkUserAccess(playlistId: string, userId: string): Promise<boolean> {
    return sql`
      SELECT 1 FROM "Playlist"
      WHERE id = ${playlistId} AND "user_id" = ${userId}
    `.then((result) => result.length > 0)
  }

  create(playlist: Omit<PlaylistEntity, 'id'>): Promise<void> {
    return sql`
      INSERT INTO "Playlist" ${sql(playlist)}
    `.then()
  }

  delete(playlistId: string): Promise<void> {
    return sql`
      DELETE FROM "Playlist"
      WHERE id = ${playlistId}
    `.then()
  }

  update(playlist: PlaylistEntity): Promise<void> {
    return sql`
      UPDATE "Playlist" SET ${sql(playlist)}
      WHERE id = ${playlist.id}
    `.then()
  }

  getItems(userId: string, pageOptionsDto: PageOptionsDto): Promise<Pagination<PlaylistEntity>> {
    return sql<PlaylistEntity[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.type
      FROM "Playlist" p
      WHERE p."user_id" = ${userId}
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `.then((result) => PaginationMapper.toPaginatedResponse(result, pageOptionsDto))
  }

  getItemsWithTrackIds(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<Pagination<PlaylistWithTrackIdsEntity>> {
    return sql<PlaylistWithTrackIdsEntity[]>`
      SELECT 
        p.id,
        p.name,
        array_agg(
          pt.track_id
        ) FILTER (WHERE pt.track_id IS NOT NULL) as tracks,
        array_agg(
          DISTINCT jsonb_build_object(
            'url', pi.url,
            'resolution', pi.resolution
          )
        ) FILTER (WHERE pi.url IS NOT NULL) as images
      FROM "Playlist" p
        LEFT JOIN "PlaylistTrack" pt ON p.id = pt.playlist_id
        LEFT JOIN "PlaylistImage" pi ON pi.playlist_id = p.id
      WHERE p."user_id" = ${userId}
      GROUP BY p.id
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `.then((result) => PaginationMapper.toPaginatedResponse(result, pageOptionsDto))
  }
}

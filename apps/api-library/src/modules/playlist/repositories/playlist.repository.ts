import { Injectable } from '@nestjs/common'

import { PlaylistEntity, PlaylistWithTrackIdsEntity } from '../entities'

import { DatabaseService } from '@modules/database'
import { PageOptionsDto } from '@modules/shared/dtos'
import { Pagination } from '@modules/shared/models'
import { PaginationMapper } from '@modules/shared/mappers'

@Injectable()
export class PlaylistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  checkUserAccess(playlistId: string, userId: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1 FROM "Playlist"
      WHERE id = ${playlistId} AND "user_id" = ${userId}
    `.then((result) => result.length > 0)
  }

  create(playlist: Omit<PlaylistEntity, 'id' | 'images'>): Promise<void> {
    return this.databaseService.sql`
      INSERT INTO "Playlist" ${this.databaseService.sql(playlist)}
    `.then()
  }

  delete(playlistId: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "Playlist"
      WHERE id = ${playlistId}
    `.then()
  }

  update(playlist: Omit<PlaylistEntity, 'images'>): Promise<void> {
    return this.databaseService.sql`
      UPDATE "Playlist" SET ${this.databaseService.sql(playlist)}
      WHERE id = ${this.databaseService.sql(playlist.id)}
    `.then()
  }

  getItems(userId: string, pageOptionsDto: PageOptionsDto): Promise<Pagination<PlaylistEntity>> {
    return this.databaseService.sql<PlaylistEntity[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.type,
        array_agg(
          DISTINCT jsonb_build_object(
            'url', pi.url,
            'resolution', pi.resolution
          )
        ) FILTER (WHERE pi.url IS NOT NULL) as images
      FROM "Playlist" p
        LEFT JOIN "PlaylistImage" pi ON pi.playlist_id = p.id
      WHERE p."user_id" = ${userId}
      GROUP BY p.id
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `.then((result) => PaginationMapper.toPaginatedResponse(result, pageOptionsDto))
  }

  getById(playlistId: string): Promise<PlaylistEntity> {
    return this.databaseService.sql<PlaylistEntity[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.type,
        array_agg(
          DISTINCT jsonb_build_object(
            'url', pi.url,
            'resolution', pi.resolution
          )
        ) FILTER (WHERE pi.url IS NOT NULL) as images
      FROM "Playlist" p
        LEFT JOIN "PlaylistImage" pi ON pi.playlist_id = p.id
      WHERE p.id = ${playlistId}
      GROUP BY p.id
      LIMIT 1
    `.then((result) => result[0])
  }

  getItemsWithTrackIds(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<Pagination<PlaylistWithTrackIdsEntity>> {
    return this.databaseService.sql<PlaylistWithTrackIdsEntity[]>`
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

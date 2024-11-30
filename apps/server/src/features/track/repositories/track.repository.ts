import { TrackEntity } from '../entities'
import { QueueTrack } from '../models'

import { PageOptionsDto } from '@common/dto'
import { sql } from 'src/db'

export class TrackRepository {
  exists(trackId: string): Promise<boolean> {
    return sql`
      SELECT 1
      FROM "Track"
      WHERE id = ${trackId}
    `.then((result) => result.length > 0)
  }

  getItems(trackIds: string[]): Promise<TrackEntity[]> {
    return sql<TrackEntity[]>`
      ${TrackRepository.selectFragment}
      WHERE t.id IN ${sql(trackIds)}
      GROUP BY t.id
    `
  }

  getQueueItems(trackIds: string[]): Promise<QueueTrack[]> {
    return sql<QueueTrack[]>`
      SELECT
        t.id,
        t.title,
        t.duration
      FROM "Track" t
      WHERE t.id IN ${sql(trackIds)}
      GROUP BY t.id
    `
  }

  getNewItems(pageOptionsDto: PageOptionsDto): Promise<TrackEntity[]> {
    return sql<TrackEntity[]>`
      ${TrackRepository.selectFragment}
      GROUP BY t.id
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `
  }

  getPopularItems(pageOptionsDto: PageOptionsDto): Promise<TrackEntity[]> {
    return sql<TrackEntity[]>`
      ${TrackRepository.selectFragment}
      GROUP BY t.id
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `
  }

  getItemsByAlbumId(albumId: string): Promise<TrackEntity[]> {
    return sql<TrackEntity[]>`
      ${TrackRepository.selectFragment}
      WHERE t.album_id = ${albumId}
      GROUP BY t.id
    `
  }

  getAlbumTrackIds(albumId: string): Promise<string[]> {
    return sql<{ id: string }[]>`
      SELECT t.id
      FROM "Track" t
      WHERE t.album_id = ${albumId}
    `.then((result) => result.map((item) => item.id))
  }

  private static readonly selectFragment = sql`
    SELECT
      t.id,
      t.title,
      t.duration,
      array_agg(
        DISTINCT jsonb_build_object(
          'id', a.id,
          'name', a.name,
          'role', ta.role
        )
      ) FILTER (WHERE a.id IS NOT NULL) as artists,
      array_agg(
        DISTINCT jsonb_build_object(
          'url', ti.url,
          'resolution', ti.resolution
        )
      ) FILTER (WHERE ti.url IS NOT NULL) as images
    FROM "Track" t
      LEFT JOIN "TrackArtist" ta ON t.id = ta.track_id
      LEFT JOIN "Artist" a ON ta.artist_id = a.id 
      LEFT JOIN "TrackImage" ti ON t.id = ti.track_id
  `

  static create(track: Omit<TrackEntity, 'id' | 'artists' | 'images'>): Promise<TrackEntity> {
    return sql`
      INSERT INTO "Track" ${sql(track)}
      RETURNING *
    `.then((result) => result.at(0) as TrackEntity)
  }
}

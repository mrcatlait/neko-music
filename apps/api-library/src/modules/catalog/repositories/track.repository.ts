import { Injectable } from '@nestjs/common'

import { TrackEntity, TrackWithAlbumAndArtistsEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class TrackRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOne<Type extends TrackEntity>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      ${this.selectTrackFragment}
      WHERE a.id = ${id}
      GROUP BY a.id
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findByAlbumId<Type extends TrackWithAlbumAndArtistsEntity>(albumId: string): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      ${this.selectTrackWithAlbumAndArtistsFragment}
      WHERE t.album_id = ${albumId}
      GROUP BY t.id
    `
  }

  private readonly selectTrackFragment = this.databaseService.sql`
    SELECT
      t.id,
      t.name,
      t.album_id as "albumId",
      t.track_number as "trackNumber",
      t.disk_number as "diskNumber",
      t.release_date as "releaseDate",
      t.duration,
      t.has_lyrics as "hasLyrics",
      t.explicit,
      t.created_at as "createdAt",
      t.updated_at as "updatedAt"
    FROM "music"."Track" t
  `

  private readonly selectTrackWithAlbumAndArtistsFragment = this.databaseService.sql`
  SELECT
    t.id,
    t.name,
    t.album_id as "albumId",
    t.track_number as "trackNumber",
    t.disk_number as "diskNumber",
    t.release_date as "releaseDate",
    t.duration,
    t.has_lyrics as "hasLyrics",
    t.explicit,
    t.created_at as "createdAt",
    t.updated_at as "updatedAt",
    a.id as "albumId",
    a.name as "albumName",
    a.type as "albumType",
    a.artwork as "artwork",
    array_agg(
      DISTINCT jsonb_build_object(
        'id', aa.artist_id,
        'name', ar.name,
      )
    ) FILTER (WHERE aa.artist_id IS NOT NULL) as artists
  FROM "music"."Track" t
    LEFT JOIN "music"."Album" a ON t.album_id = a.id
    LEFT JOIN "music"."AlbumArtist" aa ON a.id = aa.album_id
    LEFT JOIN "music"."Artist" ar ON aa.artist_id = ar.id
`
}

import { Injectable } from '@nestjs/common'

import { TrackEntity } from '../entities'

import { DatabaseService } from '@modules/database'
import { PageOptionsDto } from '@modules/shared/dtos'

@Injectable()
export class TrackRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  exists(trackId: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM "Track"
      WHERE id = ${trackId}
    `.then((result) => result.length > 0)
  }

  getItems(trackIds: string[]): Promise<TrackEntity[]> {
    return this.databaseService.sql<TrackEntity[]>`
      ${this.selectFragment}
      WHERE t.id IN ${this.databaseService.sql(trackIds)}
      GROUP BY t.id
    `
  }

  getNewItems(pageOptionsDto: PageOptionsDto): Promise<TrackEntity[]> {
    return this.databaseService.sql<TrackEntity[]>`
      ${this.selectFragment}
      GROUP BY t.id
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `
  }

  getPopularItems(pageOptionsDto: PageOptionsDto): Promise<TrackEntity[]> {
    return this.databaseService.sql<TrackEntity[]>`
      ${this.selectFragment}
      GROUP BY t.id
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.offset}
    `
  }

  getItemsByAlbumId(albumId: string): Promise<TrackEntity[]> {
    return this.databaseService.sql<TrackEntity[]>`
      ${this.selectFragment}
      WHERE t.album_id = ${albumId}
      GROUP BY t.id
    `
  }

  getItemsByPlaylistId(playlistId: string): Promise<TrackEntity[]> {
    return this.databaseService.sql<TrackEntity[]>`
      ${this.selectFragment}
      WHERE t.id IN (SELECT track_id FROM "PlaylistTrack" WHERE playlist_id = ${playlistId})
      GROUP BY t.id
    `
  }

  getItemsByArtistId(artistId: string): Promise<TrackEntity[]> {
    return this.databaseService.sql<TrackEntity[]>`
      ${this.selectFragment}
      WHERE t.id IN (SELECT track_id FROM "TrackArtist" WHERE artist_id = ${artistId})
      GROUP BY t.id
    `
  }

  getAlbumTrackIds(albumId: string): Promise<string[]> {
    return this.databaseService.sql<{ id: string }[]>`
      SELECT t.id
      FROM "Track" t
      WHERE t.album_id = ${albumId}
    `.then((result) => result.map((item) => item.id))
  }

  private readonly selectFragment = this.databaseService.sql`
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
}

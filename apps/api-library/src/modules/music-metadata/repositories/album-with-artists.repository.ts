import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@modules/database'

import { AlbumWithArtistsEntity } from '../entities'

@Injectable()
export class AlbumWithArtistsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOne(id: string): Promise<AlbumWithArtistsEntity | undefined> {
    return this.databaseService.sql<AlbumWithArtistsEntity[]>`
      ${this.selectFragment}
      WHERE a.id = ${id}
      GROUP BY a.id
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findPopular(): Promise<AlbumWithArtistsEntity[]> {
    return this.databaseService.sql<AlbumWithArtistsEntity[]>`
      ${this.selectFragment}
      GROUP BY a.id
      LIMIT 12
    `
  }

  private readonly selectFragment = this.databaseService.sql`
    SELECT
      a.id,
      a.title,
      a.release_date,
      a.explicit,
      a.type,
      a.artwork,
      a.metadata,
      a.created_at,
      a.updated_at,
      array_agg(
        DISTINCT jsonb_build_object(
          'id', aa.artist_id,
          'name', ar.name,
          'role', aa.role
        )
      ) FILTER (WHERE aa.artist_id IS NOT NULL) as artists
    FROM "music"."Album" a
      LEFT JOIN "music"."AlbumArtist" aa ON a.id = aa.album_id
      LEFT JOIN "music"."Artist" ar ON aa.artist_id = ar.id
  `
}

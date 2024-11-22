import { ArtistEntity } from '../entities'

import { sql } from 'src/db'

export class ArtistRepository {
  create(artist: Omit<ArtistEntity, 'id' | 'images'>): Promise<ArtistEntity> {
    return sql`
      INSERT INTO "Artist" ${sql(artist)}
      RETURNING *
    `.then((result) => result[0] as ArtistEntity)
  }

  getById(id: string): Promise<ArtistEntity | undefined> {
    return sql<ArtistEntity[]>`
      ${this.selectFragment}
      WHERE a.id = ${id}
      GROUP BY a.id
      LIMIT 1
    `.then((result) => result.at(0))
  }

  private readonly selectFragment = sql`
    SELECT a.*,
      array_agg(
        DISTINCT jsonb_build_object(
          'url', ai.url,
          'resolution', ai.resolution
        )
      ) FILTER (WHERE ai.url IS NOT NULL) as images
    FROM "Artist" a
      LEFT JOIN "ArtistImage" ai ON a.id = ai.artist_id
  `
}

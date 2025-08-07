import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { AlbumEntity, WithArtists, WithArtwork } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class AlbumRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends AlbumEntity>(album: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "music"."Album" (name, release_date, explicit, type)
      VALUES (${album.name}, ${album.releaseDate}, ${album.explicit}, ${album.type})
      RETURNING
        id,
        name,
        release_date as "releaseDate",
        explicit,
        type
    `.then((result) => result.at(0)!)
  }

  findOne<Type extends WithArtists<WithArtwork<AlbumEntity>>>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      ${this.selectAlbumWithArtistsAndArtworkFragment}
      WHERE a.id = ${id}
      GROUP BY a.id
      LIMIT 1
    `.then((result) => result.at(0))
  }

  exists(name: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS (SELECT 1 FROM "music"."Album" WHERE name = ${name})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  findPopular<Type extends WithArtists<WithArtwork<AlbumEntity>>>(): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      ${this.selectAlbumWithArtistsAndArtworkFragment}
      GROUP BY a.id
      LIMIT 12
    `
  }

  private readonly selectAlbumFragment = this.databaseService.sql`
    SELECT
      a.id,
      a.name,
      a.release_date as "releaseDate",
      a.explicit,
      a.type,
      a.artwork,
      a.metadata,
      a.created_at as "createdAt",
      a.updated_at as "updatedAt"
    FROM "music"."Album" a
  `

  private readonly selectAlbumWithArtistsAndArtworkFragment = this.databaseService.sql`
    SELECT
      a.id,
      a.name,
      a.release_date as "releaseDate",
      a.explicit,
      a.type,
      a.artwork,
      a.created_at as "createdAt",
      a.updated_at as "updatedAt",
      array_agg(
        DISTINCT jsonb_build_object(
          'id', aa.artist_id,
          'name', ar.name
        )
      ) FILTER (WHERE aa.artist_id IS NOT NULL) as artists
    FROM "music"."Album" a
      LEFT JOIN "music"."AlbumArtist" aa ON a.id = aa.album_id
      LEFT JOIN "music"."Artist" ar ON aa.artist_id = ar.id
  `
}

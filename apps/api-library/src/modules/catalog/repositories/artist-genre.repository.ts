import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistGenreEntity } from '../entities'

import { DatabaseService } from '@/modules/database/services'

@Injectable()
export class ArtistGenreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ArtistGenreEntity>(genre: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "catalog"."ArtistGenre" ("artistId", "genreId", "position")
      VALUES (${genre.artistId}, ${genre.genreId}, ${genre.position})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(artistId: string, genres: string[], sql?: Sql): Promise<ArtistGenreEntity[]> {
    if (genres.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<ArtistGenreEntity[]>`
      INSERT INTO "catalog"."ArtistGenre" ("artistId", "genreId")
      VALUES (${artistId}, ${this.databaseService.sql(genres)})
      RETURNING *
    `
  }

  delete(genre: Omit<ArtistGenreEntity, 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "catalog"."ArtistGenre" WHERE "artistId" = ${genre.artistId} AND "genreId" = ${genre.genreId}
    `.then(() => undefined)
  }

  deleteManyByArtistId(artistId: string, sql?: Sql): Promise<void> {
    return (sql ?? this.databaseService.sql)`
      DELETE FROM "catalog"."ArtistGenre" WHERE "artistId" = ${artistId}
    `.then(() => undefined)
  }

  findMany(artistId: string): Promise<ArtistGenreEntity[]> {
    return this.databaseService.sql<ArtistGenreEntity[]>`
      SELECT * FROM "catalog"."ArtistGenre" WHERE "artistId" = ${artistId}
    `
  }
}

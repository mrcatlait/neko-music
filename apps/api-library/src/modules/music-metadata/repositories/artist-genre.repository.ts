import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistGenreEntity } from '../entities'

import { DatabaseService } from '@modules/database/services'

@Injectable()
export class ArtistGenreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(artistGenre: Omit<ArtistGenreEntity, 'created_at'>, sql?: Sql): Promise<ArtistGenreEntity> {
    return (sql ?? this.databaseService.sql)<ArtistGenreEntity[]>`
      INSERT INTO "music"."ArtistGenre" (artist_id, genre_id)
      VALUES (${artistGenre.artist_id}, ${artistGenre.genre_id})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(artistGenres: Omit<ArtistGenreEntity, 'created_at'>[], sql?: Sql): Promise<ArtistGenreEntity[]> {
    if (artistGenres.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<ArtistGenreEntity[]>`
      INSERT INTO "music"."ArtistGenre" ${this.databaseService.sql(artistGenres)}
      RETURNING *
    `
  }

  delete(artistGenre: Omit<ArtistGenreEntity, 'created_at' | 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."ArtistGenre" WHERE artist_id = ${artistGenre.artist_id} AND genre_id = ${artistGenre.genre_id}
    `.then(() => undefined)
  }

  deleteMany(artistGenres: Omit<ArtistGenreEntity, 'created_at' | 'position'>[]): Promise<void> {
    if (artistGenres.length === 0) {
      return Promise.resolve()
    }

    return this.databaseService.sql`
      DELETE FROM "music"."ArtistGenre" ${this.databaseService.sql(artistGenres)}
    `.then(() => undefined)
  }
}

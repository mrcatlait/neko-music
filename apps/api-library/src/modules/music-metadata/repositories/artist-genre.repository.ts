import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistGenreEntity } from '../entities'

import { DatabaseService } from '@modules/database/services'

@Injectable()
export class ArtistGenreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ArtistGenreEntity>(genre: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "music"."ArtistGenre" (artist_id, genre_id)
      VALUES (${genre.artistId}, ${genre.genreId})
      RETURNING
        artist_id as "artistId",
        genre_id as "genreId",
        position
    `.then((result) => result.at(0)!)
  }

  createMany(artistId: string, genres: string[], sql?: Sql): Promise<ArtistGenreEntity[]> {
    if (genres.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<ArtistGenreEntity[]>`
      INSERT INTO "music"."ArtistGenre" (artist_id, genre_id)
      VALUES (${artistId}, ${this.databaseService.sql(genres)})
      RETURNING
        artist_id as "artistId",
        genre_id as "genreId",
        position
    `
  }

  delete(genre: Omit<ArtistGenreEntity, 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."ArtistGenre" WHERE artist_id = ${genre.artistId} AND genre_id = ${genre.genreId}
    `.then(() => undefined)
  }

  deleteMany(genres: Omit<ArtistGenreEntity, 'position'>[]): Promise<void> {
    if (genres.length === 0) {
      return Promise.resolve()
    }

    return this.databaseService.sql`
      DELETE FROM "music"."ArtistGenre" ${this.databaseService.sql(genres)}
    `.then(() => undefined)
  }
}

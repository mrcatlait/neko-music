import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { AlbumGenreEntity } from '../entities'

import { DatabaseService } from '@modules/database/services'

@Injectable()
export class AlbumGenreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends AlbumGenreEntity>(genre: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "music"."AlbumGenre" (album_id, genre_id)
      VALUES (${genre.albumId}, ${genre.genreId})
      RETURNING
        album_id as "albumId",
        genre_id as "genreId",
        position
    `.then((result) => result.at(0)!)
  }

  createMany(genres: AlbumGenreEntity[], sql?: Sql): Promise<AlbumGenreEntity[]> {
    if (genres.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<AlbumGenreEntity[]>`
      INSERT INTO "music"."AlbumGenre" ${this.databaseService.sql(genres)}
      RETURNING
        album_id as "albumId",
        genre_id as "genreId",
        position
    `
  }

  delete(genre: Omit<AlbumGenreEntity, 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."AlbumGenre" WHERE album_id = ${genre.albumId} AND genre_id = ${genre.genreId}
    `.then(() => undefined)
  }

  deleteMany(genres: Omit<AlbumGenreEntity, 'position'>[]): Promise<void> {
    if (genres.length === 0) {
      return Promise.resolve()
    }

    return this.databaseService.sql`
      DELETE FROM "music"."AlbumGenre" ${this.databaseService.sql(genres)}
    `.then(() => undefined)
  }
}

import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { TrackGenreEntity } from '../entities'

import { DatabaseService } from '@/modules/database/services'

@Injectable()
export class TrackGenreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends TrackGenreEntity>(genre: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "catalog"."TrackGenre" ("trackId", "genreId")
      VALUES (${genre.trackId}, ${genre.genreId})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(genres: TrackGenreEntity[], sql?: Sql): Promise<TrackGenreEntity[]> {
    if (genres.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<TrackGenreEntity[]>`
      INSERT INTO "catalog"."TrackGenre" ${this.databaseService.sql(genres)}
      RETURNING *
    `
  }

  delete(genre: Omit<TrackGenreEntity, 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "catalog"."TrackGenre" WHERE "trackId" = ${genre.trackId} AND "genreId" = ${genre.genreId}
    `.then(() => undefined)
  }

  deleteMany(genres: Omit<TrackGenreEntity, 'position'>[]): Promise<void> {
    if (genres.length === 0) {
      return Promise.resolve()
    }

    return this.databaseService.sql`
      DELETE
      FROM "catalog"."TrackGenre"
      WHERE "trackId" IN (${this.databaseService.sql(genres.map((genre) => genre.trackId))}) AND "genreId" IN (${this.databaseService.sql(genres.map((genre) => genre.genreId))})
    `.then(() => undefined)
  }
}

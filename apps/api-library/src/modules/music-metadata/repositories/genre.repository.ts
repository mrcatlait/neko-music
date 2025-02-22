import { Injectable } from '@nestjs/common'

import { GenreEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class GenreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(genre: Omit<GenreEntity, 'id' | 'created_at' | 'updated_at'>): Promise<GenreEntity> {
    return this.databaseService.sql<GenreEntity[]>`
      INSERT INTO "music"."Genre" (name)
      VALUES (${genre.name})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(genres: Omit<GenreEntity, 'id' | 'created_at' | 'updated_at'>[]): Promise<GenreEntity[]> {
    if (genres.length === 0) {
      return Promise.resolve([])
    }

    return this.databaseService.sql<GenreEntity[]>`
      INSERT INTO "music"."Genre" ${this.databaseService.sql(genres)}
      RETURNING *
    `
  }

  findAll(): Promise<GenreEntity[]> {
    return this.databaseService.sql<GenreEntity[]>`
      SELECT * FROM "music"."Genre"
    `.then((result) => result)
  }

  findOneByName(name: string): Promise<GenreEntity | undefined> {
    return this.databaseService.sql<GenreEntity[]>`
      SELECT * FROM "music"."Genre" WHERE name = ${name}
    `.then((result) => result.at(0))
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."Genre" WHERE id = ${id}
    `.then(() => undefined)
  }

  deleteMany(ids: string[]): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."Genre" WHERE id IN ${this.databaseService.sql(ids)}
    `.then(() => undefined)
  }
}

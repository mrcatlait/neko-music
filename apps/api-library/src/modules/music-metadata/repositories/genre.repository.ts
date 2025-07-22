import { Injectable } from '@nestjs/common'

import { GenreEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class GenreRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends GenreEntity>(genre: Type): Promise<Type> {
    return this.databaseService.sql<Type[]>`
      INSERT INTO "music"."Genre" (name)
      VALUES (${genre.name})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(genres: Omit<GenreEntity, 'id'>[]): Promise<GenreEntity[]> {
    if (genres.length === 0) {
      return Promise.resolve([])
    }

    return this.databaseService.sql<GenreEntity[]>`
      INSERT INTO "music"."Genre" ${this.databaseService.sql(genres)}
      RETURNING *
    `
  }

  findAll<Type extends GenreEntity>(): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      SELECT * FROM "music"."Genre"
    `.then((result) => result)
  }

  findOneByName<Type extends GenreEntity>(name: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
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

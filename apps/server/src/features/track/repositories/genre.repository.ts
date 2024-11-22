import { GenreEntity } from '../entities'

import { sql } from 'src/db'

export class GenreRepository {
  static create(genre: Omit<GenreEntity, 'id'>): Promise<unknown> {
    return sql`
      INSERT INTO "Genre" (name)
      VALUES (${genre.name})
      RETURNING *
    `
  }

  static deleteByName(name: string): Promise<unknown> {
    return sql`
      DELETE FROM "Genre" WHERE name = ${name}
    `
  }
}

import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { InjectDatabase, Database, GenreTable } from '@/modules/database'

@Injectable()
export class GenreRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  findGenresByIds(ids: string[]): Promise<Selectable<GenreTable>[]> {
    return this.database.selectFrom('catalog.Genre').where('id', 'in', ids).selectAll().execute()
  }

  findGenreByName(name: string): Promise<Selectable<GenreTable> | undefined> {
    return this.database.selectFrom('catalog.Genre').where('name', '=', name).selectAll().executeTakeFirst()
  }

  createGenre(genre: Insertable<GenreTable>): Promise<Selectable<GenreTable>> {
    return this.database.insertInto('catalog.Genre').values(genre).returningAll().executeTakeFirstOrThrow()
  }
}

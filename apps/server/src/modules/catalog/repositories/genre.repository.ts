import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { InjectDatabase, Database, GenreTable } from '@/modules/database'

@Injectable()
export class GenreRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  findGenresByIds(ids: string[]): Promise<Selectable<GenreTable>[]> {
    return this.database.selectFrom('catalog.Genre').where('id', 'in', ids).selectAll().execute()
  }
}

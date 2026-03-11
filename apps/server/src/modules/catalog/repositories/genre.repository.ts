import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { CatalogSchema, GenreTable } from '../catalog.schema'

import { Database, InjectDatabase } from '@/modules/database'

@Injectable()
export class GenreRepository {
  constructor(@InjectDatabase() private readonly database: Database<CatalogSchema>) {}

  findGenresByIds(ids: string[]): Promise<Selectable<GenreTable>[]> {
    return this.database.selectFrom('catalog.Genre').where('id', 'in', ids).selectAll().execute()
  }
}

import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { BackstageGenreTable, BackstageSchema } from '../../backstage.schema'

import { InjectDatabase, Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

interface FindAllParameters {
  limit: number
  offset: number
}

interface FindAllResult {
  data: Selectable<BackstageGenreTable>[]
  count: number
}

@Injectable()
export class GenreRepository extends Repository<BackstageSchema, 'backstage.Genre'> {
  constructor(@InjectDatabase() database: Database<BackstageSchema>) {
    super(database, 'backstage.Genre')
  }

  findAll({ limit, offset }: FindAllParameters): Promise<FindAllResult> {
    return Promise.all([
      this.database.selectFrom('backstage.Genre').selectAll().limit(limit).offset(offset).execute(),
      this.database
        .selectFrom('backstage.Genre')
        .select((eb) => eb.fn.countAll().as('count'))
        .executeTakeFirst(),
    ]).then(([data, count]) => ({ data, count: Number(count?.count ?? 0) }))
  }
}

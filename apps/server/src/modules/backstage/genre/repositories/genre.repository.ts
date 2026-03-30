import { Injectable } from '@nestjs/common'
import { Selectable, sql } from 'kysely'

import { BackstageGenreTable, BackstageSchema } from '../../backstage.schema'

import { InjectDatabase, Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

interface FindAllParameters {
  limit?: number
  offset?: number
  search?: string
  ids?: string[]
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

  findAll({ limit, offset, search, ids }: FindAllParameters): Promise<FindAllResult> {
    return Promise.all([
      this.database
        .selectFrom('backstage.Genre')
        .selectAll()
        .$if(Boolean(ids), (eb) => eb.where('id', 'in', ids!))
        .$if(Boolean(search), (eb) =>
          eb
            .where((nestedEb) => sql`levenshtein(${nestedEb.ref('name')}::text, ${search!}::text)`, '<=', 3)
            .orderBy((nestedEb) => sql`levenshtein(${nestedEb.ref('name')}::text, ${search!}::text)`),
        )
        .$if(Boolean(limit), (eb) => eb.limit(limit!))
        .$if(Boolean(offset), (eb) => eb.offset(offset!))
        .execute(),
      this.database
        .selectFrom('backstage.Genre')
        .select((eb) => eb.fn.countAll().as('count'))
        .$if(Boolean(ids), (eb) => eb.where('id', 'in', ids!))
        .$if(Boolean(search), (eb) =>
          eb.where((nestedEb) => sql`levenshtein(${nestedEb.ref('name')}::text, ${search!}::text)`, '<=', 3),
        )
        .executeTakeFirst(),
    ]).then(([data, count]) => ({ data, count: Number(count?.count ?? 0) }))
  }
}

import { Injectable } from '@nestjs/common'
import { Selectable, sql } from 'kysely'

import { BackstageGenreTable, BackstageSchema } from '../../backstage.schema'

import { InjectDatabase, Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

interface FindAllParameters {
  limit: number
  offset: number
  search?: string
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

  findAll({ limit, offset, search }: FindAllParameters): Promise<FindAllResult> {
    return Promise.all([
      this.database
        .selectFrom('backstage.Genre')
        .selectAll()
        .$if(Boolean(search), (eb) =>
          eb
            .where((nestedEb) => sql`levenshtein(${nestedEb.ref('name')}::text, ${search!}::text)`, '<=', 3)
            .orderBy((nestedEb) => sql`levenshtein(${nestedEb.ref('name')}::text, ${search!}::text)`),
        )
        .limit(limit)
        .offset(offset)
        .execute(),
      this.database
        .selectFrom('backstage.Genre')
        .select((eb) => eb.fn.countAll().as('count'))
        .$if(Boolean(search), (eb) =>
          eb.where((nestedEb) => sql`levenshtein(${nestedEb.ref('name')}::text, ${search!}::text)`, '<=', 3),
        )
        .executeTakeFirst(),
    ]).then(([data, count]) => ({ data, count: Number(count?.count ?? 0) }))
  }
}

import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { BackstageAlbumTable, BackstageSchema } from '../../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

interface FindAllParameters {
  limit?: number
  offset?: number
}

interface FindAllResult {
  data: Selectable<BackstageAlbumTable>[]
  count: number
}

@Injectable()
export class AlbumRepository extends Repository<BackstageSchema, 'backstage.Album'> {
  constructor(@InjectDatabase() database: Database<BackstageSchema>) {
    super(database, 'backstage.Album')
  }

  findAll({ limit, offset }: FindAllParameters): Promise<FindAllResult> {
    return Promise.all([
      this.database
        .selectFrom('backstage.Album')
        .selectAll()
        .$if(Boolean(limit), (eb) => eb.limit(limit!))
        .$if(Boolean(offset), (eb) => eb.offset(offset!))
        .execute(),
      this.database
        .selectFrom('backstage.Album')
        .select((eb) => eb.fn.countAll().as('count'))
        .executeTakeFirst(),
    ]).then(([data, count]) => ({ data, count: Number(count?.count ?? 0) }))
  }
}

import { Injectable } from '@nestjs/common'

import { Selectable } from 'kysely'

import { ImportSchema, MetadataClaimTable } from '../import.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class MetadataClaimRepository extends Repository<ImportSchema, 'import.MetadataClaim'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.MetadataClaim')
  }

  findByImportJobItemId(importJobItemId: string): Promise<Selectable<MetadataClaimTable>[]> {
    return this.database
      .selectFrom('import.MetadataClaim')
      .where('importJobItemId', '=', importJobItemId)
      .selectAll()
      .execute()
  }
}

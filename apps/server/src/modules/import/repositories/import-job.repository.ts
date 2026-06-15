import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { ImportJobTable, ImportSchema } from '../import.schema'
import { ImportStatus } from '../enums'

import { Repository } from '@/modules/shared/classes'
import { Database } from '@/modules/database/types'
import { InjectDatabase } from '@/modules/database/database.injector'

@Injectable()
export class ImportJobRepository extends Repository<ImportSchema, 'import.ImportJob'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.ImportJob')
  }

  findPendingImportJob(): Promise<Selectable<ImportJobTable> | undefined> {
    return this.database
      .selectFrom('import.ImportJob')
      .where('status', '=', ImportStatus.Pending)
      .orderBy('createdAt', 'asc')
      .selectAll()
      .executeTakeFirst()
  }

  findRunnableImportJobs(limit = 20): Promise<Selectable<ImportJobTable>[]> {
    return this.database
      .selectFrom('import.ImportJob')
      .where('status', 'in', [ImportStatus.Pending, ImportStatus.InProgress])
      .orderBy('createdAt', 'asc')
      .limit(limit)
      .selectAll()
      .execute()
  }

  findByDiscoveryId(discoveryId: string): Promise<Selectable<ImportJobTable> | undefined> {
    return this.database
      .selectFrom('import.ImportJob')
      .where('discoveryId', '=', discoveryId)
      .selectAll()
      .executeTakeFirst()
  }

  findRecent(limit = 50): Promise<Selectable<ImportJobTable>[]> {
    return this.database
      .selectFrom('import.ImportJob')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .selectAll()
      .execute()
  }
}

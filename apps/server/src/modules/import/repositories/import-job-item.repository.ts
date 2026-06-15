import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { ImportJobItemTable, ImportSchema } from '../import.schema'
import { ImportStatus } from '../enums'

import { InjectDatabase } from '@/modules/database/database.injector'
import { Repository } from '@/modules/shared/classes'
import { Database } from '@/modules/database'

@Injectable()
export class ImportJobItemRepository extends Repository<ImportSchema, 'import.ImportJobItem'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.ImportJobItem')
  }

  findPendingOrInProgressByJobId(jobId: string): Promise<Selectable<ImportJobItemTable>[]> {
    return this.database
      .selectFrom('import.ImportJobItem')
      .where('jobId', '=', jobId)
      .where('status', 'in', [ImportStatus.Pending, ImportStatus.InProgress])
      .orderBy('id', 'asc')
      .selectAll()
      .execute()
  }

  findExistingCanonicalRefs(dataSource: string, sourceItemRefs: string[]): Promise<Set<string>> {
    if (sourceItemRefs.length === 0) {
      return Promise.resolve(new Set())
    }

    return this.database
      .selectFrom('import.ImportJobItem as item')
      .innerJoin('import.ImportJob as job', 'job.id', 'item.jobId')
      .where('job.dataSource', '=', dataSource)
      .where('item.sourceItemRef', 'in', sourceItemRefs)
      .where('item.status', 'in', [
        ImportStatus.Pending,
        ImportStatus.InProgress,
        ImportStatus.CancelRequested,
        ImportStatus.Completed,
      ])
      .select('item.sourceItemRef')
      .execute()
      .then((rows) => new Set(rows.map((row) => row.sourceItemRef)))
  }
}

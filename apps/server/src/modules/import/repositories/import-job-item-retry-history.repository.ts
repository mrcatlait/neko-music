import { Injectable } from '@nestjs/common'

import { ImportSchema } from '../import.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class ImportJobItemRetryHistoryRepository extends Repository<ImportSchema, 'import.ImportJobItemRetryHistory'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.ImportJobItemRetryHistory')
  }
}

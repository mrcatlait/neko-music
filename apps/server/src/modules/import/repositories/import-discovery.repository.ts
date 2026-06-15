import { Injectable } from '@nestjs/common'

import { ImportSchema } from '../import.schema'

import { InjectDatabase } from '@/modules/database/database.injector'
import { Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class ImportDiscoveryRepository extends Repository<ImportSchema, 'import.ImportDiscovery'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.ImportDiscovery')
  }
}

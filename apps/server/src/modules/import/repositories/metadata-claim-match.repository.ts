import { Injectable } from '@nestjs/common'

import { ImportSchema } from '../import.schema'

import { InjectDatabase, Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class MetadataClaimMatchRepository extends Repository<ImportSchema, 'import.MetadataClaimMatch'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.MetadataClaimMatch')
  }
}

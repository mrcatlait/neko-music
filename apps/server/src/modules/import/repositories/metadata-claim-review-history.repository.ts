import { Injectable } from '@nestjs/common'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

import { ImportSchema } from '../import.schema'

@Injectable()
export class MetadataClaimReviewHistoryRepository extends Repository<ImportSchema, 'import.MetadataClaimReviewHistory'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.MetadataClaimReviewHistory')
  }
}

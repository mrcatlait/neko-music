import { Injectable } from '@nestjs/common'

import { MediaSchema } from '../media.schema'

import { InjectDatabase, Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class ProcessingJobItemRepository extends Repository<MediaSchema, 'media.ProcessingJobItem'> {
  constructor(@InjectDatabase() database: Database<MediaSchema>) {
    super(database, 'media.ProcessingJobItem')
  }
}

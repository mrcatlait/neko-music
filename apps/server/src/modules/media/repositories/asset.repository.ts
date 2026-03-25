import { Injectable } from '@nestjs/common'

import { MediaSchema } from '../media.schema'

import { InjectDatabase, Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes/repository.class'

@Injectable()
export class AssetRepository extends Repository<MediaSchema, 'media.Asset'> {
  constructor(@InjectDatabase() database: Database<MediaSchema>) {
    super(database, 'media.Asset')
  }
}

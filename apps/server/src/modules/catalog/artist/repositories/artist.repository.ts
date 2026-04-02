import { Injectable } from '@nestjs/common'

import { CatalogSchema } from '../../catalog.schema'

import { Repository } from '@/modules/shared/classes'
import { Database, InjectDatabase } from '@/modules/database'

@Injectable()
export class ArtistRepository extends Repository<CatalogSchema, 'catalog.Artist'> {
  constructor(@InjectDatabase() database: Database<CatalogSchema>) {
    super(database, 'catalog.Artist')
  }
}

import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { ImageMetadataTable, MediaSchema } from '../media.schema'

import { InjectDatabase, Database } from '@/modules/database'

@Injectable()
export class ImageMetadataRepository {
  constructor(@InjectDatabase() private readonly database: Database<MediaSchema>) {}

  create(imageMetadata: Insertable<ImageMetadataTable>): Promise<Selectable<ImageMetadataTable>> {
    return this.database
      .insertInto('media.ImageMetadata')
      .values(imageMetadata)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  deleteByAssetId(assetId: string): Promise<void> {
    return this.database
      .deleteFrom('media.ImageMetadata')
      .where('assetId', '=', assetId)
      .execute()
      .then(() => undefined)
  }
}

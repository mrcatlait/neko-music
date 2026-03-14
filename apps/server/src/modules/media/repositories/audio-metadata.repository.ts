import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { AudioMetadataTable, MediaSchema } from '../media.schema'

import { InjectDatabase, Database } from '@/modules/database'

@Injectable()
export class AudioMetadataRepository {
  constructor(@InjectDatabase() private readonly database: Database<MediaSchema>) {}

  create(audioMetadata: Insertable<AudioMetadataTable>): Promise<Selectable<AudioMetadataTable>> {
    return this.database
      .insertInto('media.AudioMetadata')
      .values(audioMetadata)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  deleteByAssetId(assetId: string): Promise<void> {
    return this.database
      .deleteFrom('media.AudioMetadata')
      .where('assetId', '=', assetId)
      .execute()
      .then(() => undefined)
  }
}

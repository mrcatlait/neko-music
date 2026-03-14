import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { EntityType } from '../enums'
import { MediaSchema, SourceAssetTable } from '../media.schema'

import { InjectDatabase, Database } from '@/modules/database'

@Injectable()
export class SourceAssetRepository {
  constructor(@InjectDatabase() private readonly database: Database<MediaSchema>) {}

  create(sourceAsset: Insertable<SourceAssetTable>): Promise<Selectable<SourceAssetTable>> {
    return this.database.insertInto('media.SourceAsset').values(sourceAsset).returningAll().executeTakeFirstOrThrow()
  }

  findById(id: string): Promise<Selectable<SourceAssetTable> | undefined> {
    return this.database.selectFrom('media.SourceAsset').where('id', '=', id).selectAll().executeTakeFirst()
  }

  findAllByEntityTypeAndEntityId(entityType: EntityType, entityId: string): Promise<Selectable<SourceAssetTable>[]> {
    return this.database
      .selectFrom('media.SourceAsset')
      .where('entityType', '=', entityType)
      .where('entityId', '=', entityId)
      .selectAll()
      .execute()
  }

  deleteById(id: string): Promise<void> {
    return this.database
      .deleteFrom('media.SourceAsset')
      .where('id', '=', id)
      .execute()
      .then(() => undefined)
  }
}

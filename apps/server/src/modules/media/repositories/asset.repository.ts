import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { AssetTable, MediaSchema } from '../media.schema'

import { InjectDatabase, Database } from '@/modules/database'

@Injectable()
export class AssetRepository {
  constructor(@InjectDatabase() private readonly database: Database<MediaSchema>) {}

  create(asset: Insertable<AssetTable>): Promise<Selectable<AssetTable>> {
    return this.database.insertInto('media.Asset').values(asset).returningAll().executeTakeFirstOrThrow()
  }

  findById(id: string): Promise<Selectable<AssetTable> | undefined> {
    return this.database.selectFrom('media.Asset').where('id', '=', id).selectAll().executeTakeFirst()
  }

  findBySourceAssetId(sourceAssetId: string): Promise<Selectable<AssetTable>[]> {
    return this.database.selectFrom('media.Asset').where('sourceAssetId', '=', sourceAssetId).selectAll().execute()
  }

  update(asset: Selectable<AssetTable>): Promise<void> {
    return this.database
      .updateTable('media.Asset')
      .set(asset)
      .where('id', '=', asset.id)
      .execute()
      .then(() => undefined)
  }

  deleteById(id: string): Promise<void> {
    return this.database
      .deleteFrom('media.Asset')
      .where('id', '=', id)
      .execute()
      .then(() => undefined)
  }
}

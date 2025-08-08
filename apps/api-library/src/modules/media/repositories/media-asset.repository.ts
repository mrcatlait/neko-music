import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { MediaAssetEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class MediaAssetRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends MediaAssetEntity>(mediaAsset: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."MediaAsset" (entity_type, entity_id, source_id, storage_provider, storage_path)
      VALUES (${mediaAsset.entityType}, ${mediaAsset.entityId}, ${mediaAsset.sourceId}, ${mediaAsset.storageProvider}, ${mediaAsset.storagePath})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  update(mediaAsset: MediaAssetEntity, sql?: Sql): Promise<MediaAssetEntity> {
    return (sql ?? this.databaseService.sql)<MediaAssetEntity[]>`
      UPDATE "media"."MediaAsset"
      SET ${this.databaseService.sql(mediaAsset)}
      WHERE id = ${mediaAsset.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "media"."MediaAsset" WHERE id = ${id}
    `.then(() => undefined)
  }

  findOne<Type extends MediaAssetEntity>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."MediaAsset"
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }
}

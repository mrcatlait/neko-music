import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { MediaAssetEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class MediaAssetRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(mediaAsset: Omit<MediaAssetEntity, 'id'>, transaction?: Sql): Promise<MediaAssetEntity> {
    const sql = transaction ?? this.databaseService.sql

    return sql<MediaAssetEntity[]>`
      INSERT INTO "media"."MediaAsset"
      ${sql(mediaAsset)}
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

  findManyBySourceId<Type extends MediaAssetEntity>(sourceId: string): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."MediaAsset"
      WHERE "sourceId" = ${sourceId}
    `.then((result) => result)
  }
}

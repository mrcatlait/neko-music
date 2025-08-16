import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { MediaImageMetadataEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class MediaImageMetadataRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends MediaImageMetadataEntity>(metadata: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."MediaImageMetadata" ("assetId", "width", "height", "dominantColor")
      VALUES (${metadata.assetId}, ${metadata.width}, ${metadata.height}, ${metadata.dominantColor})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findOne<Type extends MediaImageMetadataEntity>(assetId: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."MediaImageMetadata"
      WHERE "assetId" = ${assetId}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  update(metadata: MediaImageMetadataEntity, sql?: Sql): Promise<MediaImageMetadataEntity> {
    return (sql ?? this.databaseService.sql)<MediaImageMetadataEntity[]>`
      UPDATE "media"."MediaImageMetadata" 
      SET "width" = ${metadata.width}, "height" = ${metadata.height}, "dominantColor" = ${metadata.dominantColor}
      WHERE "assetId" = ${metadata.assetId}
      RETURNING *
    `.then((result) => result.at(0)!)
  }
}

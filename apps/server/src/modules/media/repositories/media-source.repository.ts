import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { MediaSourceEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class MediaSourceRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends MediaSourceEntity>(mediaSource: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."MediaSource" ("mediaType", "entityId", "entityType", "format", "fileSize", "storageProvider", "storagePath")
      VALUES (${mediaSource.mediaType}, ${mediaSource.entityId}, ${mediaSource.entityType}, ${mediaSource.format}, ${mediaSource.fileSize}, ${mediaSource.storageProvider}, ${mediaSource.storagePath})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findOne<Type extends MediaSourceEntity>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."MediaSource"
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }
}

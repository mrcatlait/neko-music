import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { UploadTokenEntity } from '../entities'
import { MediaType } from '../enums'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class UploadTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends UploadTokenEntity>(uploadToken: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."UploadToken" ("userId", "mediaType", "entityType", "entityId", "expiresAt")
      VALUES (${uploadToken.userId}, ${uploadToken.mediaType}, ${uploadToken.entityType}, ${uploadToken.entityId}, ${uploadToken.expiresAt})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findOne<Type extends UploadTokenEntity>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."UploadToken"
      WHERE "id" = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findExpiredTokens<Type extends UploadTokenEntity>(now: Date): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."UploadToken"
      WHERE "expiresAt" < ${now}
    `.then((result) => result)
  }

  findOneByUserIdAndType<Type extends UploadTokenEntity>(
    userId: string,
    mediaType: MediaType,
  ): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."UploadToken"
      WHERE "userId" = ${userId} AND "mediaType" = ${mediaType}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  delete(id: string, sql?: Sql): Promise<void> {
    return (sql ?? this.databaseService.sql)`
      DELETE FROM "media"."UploadToken" WHERE "id" = ${id}
    `.then(() => undefined)
  }

  deleteExpiredTokens(): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "media"."UploadToken" WHERE "expiresAt" < NOW()
    `.then(() => undefined)
  }
}

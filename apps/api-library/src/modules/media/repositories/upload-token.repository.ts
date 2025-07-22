import { Injectable } from '@nestjs/common'

import { UploadTokenEntity } from '../entities'
import { MediaType } from '../enums'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UploadTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(uploadToken: Omit<UploadTokenEntity, 'id' | 'created_at'>): Promise<UploadTokenEntity> {
    return this.databaseService.sql<UploadTokenEntity[]>`
      INSERT INTO "media"."UploadToken" ${this.databaseService.sql(uploadToken)}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findOne<Type extends UploadTokenEntity>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      ${this.selectFragment}
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findExpiredTokens<Type extends UploadTokenEntity>(now: Date): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      ${this.selectFragment}
      WHERE expires_at < ${now}
    `.then((result) => result)
  }

  findOneByUserIdAndType<Type extends UploadTokenEntity>(
    userId: string,
    mediaType: MediaType,
  ): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      ${this.selectFragment}
      WHERE user_id = ${userId} AND media_type = ${mediaType}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "media"."UploadToken" WHERE id = ${id}
    `.then(() => undefined)
  }

  private readonly selectFragment = `
    SELECT
      id,
      user_id AS "userId",
      media_type AS "mediaType",
      expires_at AS "expiresAt",
      created_at AS "createdAt"
    FROM "media"."UploadToken"
  `
}

import { Injectable } from '@nestjs/common'

import { DatabaseService } from '@modules/database'

import { UploadTokenEntity } from '../entity'

@Injectable()
export class UploadTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  getById(id: string): Promise<UploadTokenEntity | undefined> {
    return this.databaseService.sql<UploadTokenEntity[]>`
      SELECT * FROM "media"."UploadToken" WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  create(uploadToken: Omit<UploadTokenEntity, 'id' | 'created_at'>): Promise<UploadTokenEntity> {
    return this.databaseService.sql<UploadTokenEntity[]>`
      INSERT INTO "media"."UploadToken" ${this.databaseService.sql(uploadToken)}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findExpiredTokens(now: Date): Promise<UploadTokenEntity[]> {
    return this.databaseService.sql<UploadTokenEntity[]>`
      SELECT * FROM "media"."UploadToken" WHERE expires_at < ${now}
    `.then((result) => result)
  }

  findByUserIdAndEntityId(userId: string, entityId: string): Promise<UploadTokenEntity | undefined> {
    return this.databaseService.sql<UploadTokenEntity[]>`
      SELECT * FROM "media"."UploadToken" WHERE user_id = ${userId} AND entity_id = ${entityId}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "media"."UploadToken" WHERE id = ${id}
    `.then(() => undefined)
  }
}

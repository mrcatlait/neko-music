import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { Database, InjectDatabase, UploadTokenTable } from '@/modules/database'

@Injectable()
export class UploadTokenRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  /**
   * Find upload token by ID
   */
  findById(id: string): Promise<Selectable<UploadTokenTable> | undefined> {
    return this.database.selectFrom('media.UploadToken').where('id', '=', id).selectAll().executeTakeFirst()
  }

  /**
   * Create upload token
   */
  create(uploadToken: Insertable<UploadTokenTable>): Promise<Selectable<UploadTokenTable>> {
    return this.database.insertInto('media.UploadToken').values(uploadToken).returningAll().executeTakeFirstOrThrow()
  }

  /**
   * Delete upload token by ID
   */
  deleteById(id: string): Promise<void> {
    return this.database
      .deleteFrom('media.UploadToken')
      .where('id', '=', id)
      .execute()
      .then(() => undefined)
  }

  /**
   * Delete expired upload tokens
   */
  deleteExpired(): Promise<void> {
    return this.database
      .deleteFrom('media.UploadToken')
      .where('expiresAt', '<', new Date())
      .execute()
      .then(() => undefined)
  }
}

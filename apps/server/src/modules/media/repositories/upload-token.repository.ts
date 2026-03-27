import { Injectable } from '@nestjs/common'

import { MediaSchema } from '../media.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class UploadTokenRepository extends Repository<MediaSchema, 'media.UploadToken'> {
  constructor(@InjectDatabase() database: Database<MediaSchema>) {
    super(database, 'media.UploadToken')
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

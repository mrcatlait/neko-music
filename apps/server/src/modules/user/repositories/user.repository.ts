import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { Database, InjectDatabase, ProfileTable } from '@/modules/database'

@Injectable()
export class UserRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  createProfile(profile: Insertable<ProfileTable>): Promise<Selectable<ProfileTable>> {
    return this.database.insertInto('user.Profile').values(profile).returningAll().executeTakeFirstOrThrow()
  }
}

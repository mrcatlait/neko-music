import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { ProfileTable, UserSchema } from '../user.schema'

import { Database, InjectDatabase } from '@/modules/database'

@Injectable()
export class UserRepository {
  constructor(@InjectDatabase() private readonly database: Database<UserSchema>) {}

  createProfile(profile: Insertable<ProfileTable>): Promise<Selectable<ProfileTable>> {
    return this.database.insertInto('user.Profile').values(profile).returningAll().executeTakeFirstOrThrow()
  }

  findProfileByUserId(userId: string): Promise<Selectable<ProfileTable> | undefined> {
    return this.database.selectFrom('user.Profile').where('userId', '=', userId).selectAll().executeTakeFirst()
  }
}

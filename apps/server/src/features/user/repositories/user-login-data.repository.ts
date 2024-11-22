import { UserLoginDataEntity } from '../entities'

import { sql } from 'src/db'

export class UserLoginDataRepository {
  static findOneByEmail(email: string): Promise<UserLoginDataEntity | undefined> {
    return sql`
      ${UserLoginDataRepository.selectFragment}
      WHERE email = ${email} LIMIT 1
    `.then((result) => result[0] as UserLoginDataEntity | undefined)
  }

  private static readonly selectFragment = sql`
    SELECT u.*
    FROM "UserLoginData" u
  `
}

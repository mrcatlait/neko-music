import { UserLoginDataEntity } from '../entities'

import { Container } from '@common/di'
import { DatabaseService } from '@common/database'

export class UserLoginDataRepository {
  private readonly databaseService: DatabaseService

  constructor() {
    this.databaseService = Container.get(DatabaseService)
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM "UserLoginData"
      WHERE email = ${email}
    `.then((result) => result.length > 0)
  }

  findOneByEmail(email: string): Promise<UserLoginDataEntity | undefined> {
    return this.databaseService.sql<UserLoginDataEntity[]>`
      ${this.selectFragment}
      WHERE email = ${email} LIMIT 1
    `.then((result) => result[0])
  }

  create(user: Omit<UserLoginDataEntity, 'user_id'>): Promise<{ user_id: string }> {
    return this.databaseService.sql<{ user_id: string }[]>`
      WITH
        user_login_data AS (
          INSERT INTO "UserLoginData" (email, password_hash, role_id)
          VALUES (${user.email}, ${user.password_hash}, ${user.role_id})
          RETURNING *
        )
      SELECT ul.user_id
      FROM user_login_data ul
      LIMIT 1
    `.then((result) => result[0])
  }

  private get selectFragment() {
    return this.databaseService.sql`
      SELECT u.*
      FROM "UserLoginData" u
    `
  }
}

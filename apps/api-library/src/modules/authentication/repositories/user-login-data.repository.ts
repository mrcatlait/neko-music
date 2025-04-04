import { Injectable } from '@nestjs/common'

import { UserLoginDataEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserLoginDataRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  existsByEmail(email: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM auth."UserLoginData"
      WHERE email = ${email}
    `.then((result) => result.length > 0)
  }

  findOneByEmail(email: string): Promise<UserLoginDataEntity | undefined> {
    return this.databaseService.sql<UserLoginDataEntity[]>`
      SELECT u.*
      FROM auth."UserLoginData" u
      WHERE email = ${email} LIMIT 1
    `.then((result) => result[0])
  }

  create(user: Omit<UserLoginDataEntity, 'user_id'>): Promise<{ user_id: string }> {
    return this.databaseService.sql<{ user_id: string }[]>`
      WITH
        user_login_data AS (
          INSERT INTO auth."UserLoginData" (email, password_hash)
          VALUES (${user.email}, ${user.password_hash})
          RETURNING *
        )
      SELECT ul.user_id
      FROM user_login_data ul
      LIMIT 1
    `.then((result) => result[0])
  }

  delete(userId: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM auth."UserLoginData"
      WHERE user_id = ${userId}
    `.then(() => undefined)
  }

  deleteByEmail(email: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM auth."UserLoginData"
      WHERE email = ${email}
    `.then(() => undefined)
  }
}

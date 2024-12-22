import { Injectable, NotFoundException } from '@nestjs/common'

import { UserEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  existsByEmail(email: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM "UserLoginData"
      WHERE email = ${email}
    `.then((result) => result.length > 0)
  }

  existsByUsername(username: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM "UserAccount"
      WHERE username = ${username}
    `.then((result) => result.length > 0)
  }

  getByEmail(email: string): Promise<UserEntity | undefined> {
    return this.databaseService.sql<UserEntity[]>`
      ${this.selectFragment}
      WHERE email = ${email}
      GROUP BY ua.id, uld.email, uld.password_hash
      LIMIT 1
    `.then((result) => result.at(0))
  }

  getByIdOrFail(id: string): Promise<UserEntity> {
    return this.databaseService.sql<UserEntity[]>`
      ${this.selectFragment}
      WHERE ua.id = ${id}
      GROUP BY ua.id, uld.email, uld.password_hash
      LIMIT 1
    `.then((result) => {
      const user = result.at(0)

      if (!user) {
        throw new NotFoundException()
      }

      return user
    })
  }

  create(user: { username: string; email: string; password_hash: string; role_id: string }): Promise<{ id: string }> {
    return this.databaseService.sql<{ id: string }[]>`
      WITH
        user_account AS (
          INSERT INTO "UserAccount" (username, role_id)
          VALUES (${user.username}, ${user.role_id})
          RETURNING *
        ),
        user_login_data AS (
          INSERT INTO "UserLoginData" (email, password_hash, user_id)
          VALUES (${user.email}, ${user.password_hash}, (SELECT id FROM user_account))
          RETURNING *
        )
      SELECT ua.id
      FROM user_account ua
      LIMIT 1
    `.then((result) => result[0])
  }

  private readonly selectFragment = this.databaseService.sql`
    SELECT ua.*,
      uld.email,
      uld.password_hash,
      array_agg(
        p.action
      ) FILTER (WHERE p.action IS NOT NULL) as permissions
    FROM "UserAccount" ua
      LEFT JOIN "UserLoginData" uld ON uld.user_id = ua.id
      LEFT JOIN "UserRole" ur ON ur.id = ua.role_id
      LEFT JOIN "GrantedPermission" gp ON gp.role_id = ur.id
      LEFT JOIN "Permission" p ON p.id = gp.permission_id
  `
}

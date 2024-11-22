import { UserRoleEntity } from '../entities'

import { sql } from 'src/db'

export class RoleRepository {
  getDefaultRole(): Promise<UserRoleEntity | undefined> {
    return sql<UserRoleEntity[]>`
      SELECT *
      FROM "UserRole"
      WHERE "default" = TRUE
      LIMIT 1
    `.then((result) => result.at(0))
  }
}

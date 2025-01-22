import { UserRoleEntity } from '../entities'

import { DatabaseService } from '@common/database'
import { Container } from '@common/di'

export class RoleRepository {
  private readonly databaseService: DatabaseService

  constructor() {
    this.databaseService = Container.get(DatabaseService)
  }

  getDefaultRole(): Promise<UserRoleEntity | undefined> {
    return this.databaseService.sql<UserRoleEntity[]>`
      SELECT *
      FROM "UserRole"
      WHERE "default" = TRUE
      LIMIT 1
    `.then((result) => result.at(0))
  }
}

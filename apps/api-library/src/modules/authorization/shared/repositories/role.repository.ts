import { Injectable } from '@nestjs/common'

import { UserRoleEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class RoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  getDefaultRole(): Promise<UserRoleEntity | undefined> {
    return this.databaseService.sql<UserRoleEntity[]>`
      SELECT *
      FROM "UserRole"
      WHERE "default" = TRUE
      LIMIT 1
    `.then((result) => result.at(0))
  }
}

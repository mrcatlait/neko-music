import { Injectable } from '@nestjs/common'

import { RoleEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class RoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findDefault(): Promise<RoleEntity | undefined> {
    return this.databaseService.sql<RoleEntity[]>`
      SELECT *
      FROM auth."Role"
      WHERE "default" = TRUE
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findOne(id: string): Promise<RoleEntity | undefined> {
    return this.databaseService.sql<RoleEntity[]>`
      SELECT *
      FROM auth."Role"
      WHERE "id" = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  existsById(id: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM auth."Role"
      WHERE "id" = ${id}
    `.then((result) => result.length > 0)
  }
}

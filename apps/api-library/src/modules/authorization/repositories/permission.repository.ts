import { Injectable } from '@nestjs/common'

import { PermissionEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class PermissionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  getById(id: string): Promise<PermissionEntity | undefined> {
    return this.databaseService.sql<PermissionEntity[]>`
      SELECT *
      FROM auth."Permission"
      WHERE "id" = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  existsById(id: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM auth."Permission" WHERE "id" = ${id}
    `.then((result) => result.length > 0)
  }
}

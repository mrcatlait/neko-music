import { Injectable } from '@nestjs/common'

import { UserPermissionEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserPermissionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOne(userId: string): Promise<UserPermissionEntity> {
    return this.databaseService.sql<UserPermissionEntity[]>`
      SELECT 
        ur."user_id",
        array_agg(p."action") as permissions
      FROM auth."UserRole" as ur
        INNER JOIN auth."GrantedPermission" as gp ON ur."role_id" = gp."role_id"
        INNER JOIN auth."Permission" as p ON gp."permission_id" = p."id"
      WHERE ur."user_id" = ${userId}
      GROUP BY ur."user_id"
    `.then((result) => result[0])
  }
}

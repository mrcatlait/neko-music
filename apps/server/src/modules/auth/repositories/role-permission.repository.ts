import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { RolePermissionEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends RolePermissionEntity>(rolePermission: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO auth."RolePermission" (role_id, permission_id)
      VALUES (${rolePermission.roleId}, ${rolePermission.permissionId})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(rolePermissions: RolePermissionEntity[], sql?: Sql): Promise<RolePermissionEntity[]> {
    return (sql ?? this.databaseService.sql)<RolePermissionEntity[]>`
      INSERT INTO auth."RolePermission" ${this.databaseService.sql(rolePermissions)}
      RETURNING *
    `
  }

  deleteByRoleId(roleId: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM auth."RolePermission" WHERE roleId = ${roleId}
    `.then(() => undefined)
  }

  deleteByPermissionId(permissionId: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM auth."RolePermission" WHERE permissionId = ${permissionId}
    `.then(() => undefined)
  }
}

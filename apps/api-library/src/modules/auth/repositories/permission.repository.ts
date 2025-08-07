import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { PermissionEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class PermissionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends PermissionEntity>(permission: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "auth"."Permission" (name, description)
      VALUES (${permission.name}, ${permission.description})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(permissions: Omit<PermissionEntity, 'id'>[], sql?: Sql): Promise<PermissionEntity[]> {
    return (sql ?? this.databaseService.sql)<PermissionEntity[]>`
      INSERT INTO "auth"."Permission" ${this.databaseService.sql(permissions)}
      RETURNING *
    `
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."Permission" WHERE "id" = ${id}
    `.then(() => undefined)
  }

  deleteMany(ids: string[]): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."Permission" WHERE "id" IN (${this.databaseService.sql(ids)})
    `.then(() => undefined)
  }

  findOne(id: string): Promise<PermissionEntity | undefined> {
    return this.databaseService.sql<PermissionEntity[]>`
      SELECT *
      FROM "auth"."Permission"
      WHERE "id" = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findByUserId(userId: string): Promise<PermissionEntity[]> {
    return this.databaseService.sql<PermissionEntity[]>`
      SELECT p.*
      FROM "auth"."Permission" p
        INNER JOIN "auth"."GrantedPermission" gp ON p.id = gp.permissionId
        INNER JOIN "auth"."UserRole" ur ON gp.roleId = ur.roleId
        INNER JOIN "auth"."UserAccount" ua ON ur.userId = ua.id
      WHERE ua.id = ${userId}
    `
  }

  exists(id: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM "auth"."Permission" WHERE "id" = ${id}
    `.then((result) => result.length > 0)
  }
}

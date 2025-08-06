import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { RoleEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class RoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends RoleEntity>(role: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "auth"."Role" (name, description)
      VALUES (${role.name}, ${role.description})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(roles: Omit<RoleEntity, 'id'>[], sql?: Sql): Promise<RoleEntity[]> {
    return (sql ?? this.databaseService.sql)<RoleEntity[]>`
      INSERT INTO "auth"."Role" ${this.databaseService.sql(roles)}
      RETURNING *
    `
  }

  update<Type extends RoleEntity>(role: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      UPDATE "auth"."Role"
      SET name = ${role.name}, description = ${role.description}
      WHERE "id" = ${role.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  updateMany(roles: RoleEntity[], sql?: Sql): Promise<RoleEntity[]> {
    return (sql ?? this.databaseService.sql)<RoleEntity[]>`
      UPDATE "auth"."Role"
      SET ${this.databaseService.sql(roles)}
      RETURNING *
    `
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."Role" WHERE "id" = ${id}
    `.then(() => undefined)
  }

  deleteMany(ids: string[]): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."Role" WHERE "id" IN (${this.databaseService.sql(ids)})
    `.then(() => undefined)
  }

  exists(id: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "auth"."Role" WHERE id = ${id})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  findDefault(): Promise<RoleEntity | undefined> {
    return this.databaseService.sql<RoleEntity[]>`
      SELECT * FROM "auth"."Role" WHERE "default" = TRUE
      LIMIT 1
    `.then((result) => result.at(0))
  }
}

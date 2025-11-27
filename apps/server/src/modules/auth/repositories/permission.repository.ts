import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { Database, InjectDatabase, PermissionTable } from '@/modules/database'

/**
 * Repository for Permission entity operations
 */
@Injectable()
export class PermissionRepository {
  private readonly table = 'auth.Permission' as const

  constructor(@InjectDatabase() private readonly database: Database) {}

  /**
   * Save (insert) a new permission
   */
  save(data: Insertable<PermissionTable>) {
    return this.database.insertInto(this.table).values(data).returningAll().executeTakeFirstOrThrow()
  }

  /**
   * Insert multiple permissions
   */
  insert(data: Insertable<PermissionTable>[]) {
    return this.database.insertInto(this.table).values(data).returningAll().execute()
  }

  /**
   * Find all permissions
   */
  find() {
    return this.database.selectFrom(this.table).selectAll().execute()
  }

  /**
   * Find permissions by criteria
   */
  findBy(criteria: Partial<Selectable<PermissionTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .execute()
  }

  /**
   * Find one permission by criteria
   */
  findOneBy(criteria: Partial<Selectable<PermissionTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirst()
  }

  /**
   * Find one permission by criteria or throw
   */
  findOneByOrFail(criteria: Partial<Selectable<PermissionTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirstOrThrow()
  }

  /**
   * Update permissions by criteria
   */
  update(criteria: Partial<Selectable<PermissionTable>>, data: Updateable<PermissionTable>) {
    return this.database
      .updateTable(this.table)
      .set(data)
      .where((eb) => eb.and(criteria))
      .returningAll()
      .execute()
  }

  /**
   * Delete permissions by criteria
   */
  delete(criteria: Partial<Selectable<PermissionTable>>) {
    return this.database
      .deleteFrom(this.table)
      .where((eb) => eb.and(criteria))
      .execute()
      .then(() => undefined)
  }

  /**
   * Count all permissions
   */
  async count() {
    const result = await this.database
      .selectFrom(this.table)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst()

    return Number(result?.count ?? 0)
  }

  /**
   * Count permissions by criteria
   */
  async countBy(criteria: Partial<Selectable<PermissionTable>>) {
    const result = await this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst()

    return Number(result?.count ?? 0)
  }

  /**
   * Check if permissions exist by criteria
   */
  async existsBy(criteria: Partial<Selectable<PermissionTable>>) {
    const count = await this.countBy(criteria)
    return count > 0
  }

  /**
   * Find all permissions for a user by user ID
   */
  findByUserId(userId: string) {
    return this.database
      .selectFrom(this.table)
      .innerJoin('auth.RolePermission', 'auth.RolePermission.permissionId', 'auth.Permission.id')
      .innerJoin('auth.UserAccount', 'auth.UserAccount.roleId', 'auth.RolePermission.roleId')
      .where('auth.UserAccount.id', '=', userId)
      .select(['auth.Permission.id', 'auth.Permission.name', 'auth.Permission.description'])
      .execute()
  }
}

import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { Database, InjectDatabase, RolePermissionTable } from '@/modules/database'

/**
 * Repository for RolePermission entity operations
 * Note: This is a join table without a traditional ID column
 */
@Injectable()
export class RolePermissionRepository {
  private readonly table = 'auth.RolePermission' as const

  constructor(@InjectDatabase() private readonly database: Database) {}

  /**
   * Save a single role-permission association
   */
  save(data: Insertable<RolePermissionTable>) {
    return this.database.insertInto(this.table).values(data).returningAll().executeTakeFirstOrThrow()
  }

  /**
   * Insert multiple role-permission associations
   */
  insert(data: Insertable<RolePermissionTable>[]) {
    return this.database.insertInto(this.table).values(data).returningAll().execute()
  }

  /**
   * Delete all permissions for a specific role
   * @param roleId - The role ID
   */
  async deleteByRoleId(roleId: string): Promise<void> {
    await this.database.deleteFrom(this.table).where('roleId', '=', roleId).execute()
  }

  /**
   * Delete all role associations for a specific permission
   * @param permissionId - The permission ID
   */
  async deleteByPermissionId(permissionId: string): Promise<void> {
    await this.database.deleteFrom(this.table).where('permissionId', '=', permissionId).execute()
  }

  /**
   * Find all permissions for a specific role
   * @param roleId - The role ID
   * @returns Array of role-permission records
   */
  async findByRoleId(roleId: string): Promise<Selectable<RolePermissionTable>[]> {
    return this.database.selectFrom(this.table).where('roleId', '=', roleId).selectAll().execute()
  }

  /**
   * Find all roles for a specific permission
   * @param permissionId - The permission ID
   * @returns Array of role-permission records
   */
  async findByPermissionId(permissionId: string): Promise<Selectable<RolePermissionTable>[]> {
    return this.database.selectFrom(this.table).where('permissionId', '=', permissionId).selectAll().execute()
  }
}

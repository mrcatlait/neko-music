import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { UserRoleTable } from './user-role.table'
import { PermissionTable } from './permission.table'

import { UUIDType } from '@common/constants'

export class GrantedPermissionTable {
  static readonly roleIdForeignKey = new TableForeignKey({
    columnNames: ['RoleId'],
    referencedTableName: UserRoleTable.table.name,
    referencedColumnNames: [UserRoleTable.idColumn.name],
  })

  static readonly roleIdColumn = new TableColumn({
    name: 'RoleId',
    type: UUIDType,
    foreignKeyConstraintName: this.roleIdForeignKey.name,
    isNullable: false,
  })

  static readonly permissionIdForeignKey = new TableForeignKey({
    columnNames: ['PermissionId'],
    referencedTableName: PermissionTable.table.name,
    referencedColumnNames: [PermissionTable.idColumn.name],
  })

  static readonly permissionIdColumn = new TableColumn({
    name: 'PermissionId',
    type: UUIDType,
    foreignKeyConstraintName: this.permissionIdForeignKey.name,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'GrantedPermission',
    columns: [this.roleIdColumn, this.permissionIdColumn],
    foreignKeys: [this.roleIdForeignKey, this.permissionIdForeignKey],
  })
}

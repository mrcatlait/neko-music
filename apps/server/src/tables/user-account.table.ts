import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { UserRoleTable } from './user-role.table'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'

export class UserAccountTable {
  static idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static usernameColumn = new TableColumn({
    name: 'Username',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

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

  static table = new Table({
    name: 'UserAccount',
    columns: [this.idColumn, this.usernameColumn, this.roleIdColumn],
    foreignKeys: [this.roleIdForeignKey],
  })
}

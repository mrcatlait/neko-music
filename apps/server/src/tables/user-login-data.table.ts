import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { UserAccountTable } from './user-account.table'

import { UUIDType, CharacterTypes } from '@common/constants'

export class UserLoginDataTable {
  static userIdForeignKey = new TableForeignKey({
    columnNames: ['UserId'],
    referencedTableName: UserAccountTable.table.name,
    referencedColumnNames: [UserAccountTable.idColumn.name],
  })

  static userIdColumn = new TableColumn({
    name: 'UserId',
    type: UUIDType,
    foreignKeyConstraintName: this.userIdForeignKey.name,
    isPrimary: true,
    isNullable: false,
    isUnique: true,
  })

  static emailColumn = new TableColumn({
    name: 'Email',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

  static passwordHashColumn = new TableColumn({
    name: 'PasswordHash',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
  })

  static table = new Table({
    name: 'UserLoginData',
    columns: [this.userIdColumn, this.emailColumn, this.passwordHashColumn],
    foreignKeys: [this.userIdForeignKey],
  })
}

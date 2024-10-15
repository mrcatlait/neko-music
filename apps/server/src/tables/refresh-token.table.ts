import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { UserAccountTable } from './user-account.table'

import { CharacterTypes, UUIDType, DateTimeTypes } from '@common/constants'

export class RefreshTokenTable {
  static refreshTokenColumn = new TableColumn({
    name: 'RefreshToken',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static userIdForeignKey = new TableForeignKey({
    columnNames: ['UserId'],
    referencedTableName: UserAccountTable.table.name,
    referencedColumnNames: [UserAccountTable.idColumn.name],
  })

  static userIdColumn = new TableColumn({
    name: 'UserId',
    type: UUIDType,
    foreignKeyConstraintName: this.userIdForeignKey.name,
    isNullable: false,
    isUnique: true,
  })

  static expiresAtColumn = new TableColumn({
    name: 'ExpiresAt',
    type: DateTimeTypes.timestamp,
    isNullable: false,
  })

  static table = new Table({
    name: 'RefreshToken',
    columns: [this.refreshTokenColumn, this.userIdColumn, this.expiresAtColumn],
    foreignKeys: [this.userIdForeignKey],
  })
}

import { Table, TableColumn } from 'typeorm'

import { CharacterTypes, UUIDGenerator, UUIDType } from '@common/constants'

export class UserRoleTable {
  static idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static nameColumn = new TableColumn({
    name: 'Name',
    length: '20',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

  static descriptionColumn = new TableColumn({
    name: 'Description',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: true,
  })

  static table = new Table({
    name: 'UserRole',
    columns: [this.idColumn, this.nameColumn, this.descriptionColumn],
  })
}

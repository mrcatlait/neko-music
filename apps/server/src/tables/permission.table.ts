import { Table, TableColumn } from 'typeorm'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'
export class PermissionTable {
  static readonly idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static readonly actionColumn = new TableColumn({
    name: 'Action',
    length: '50',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

  static readonly descriptionColumn = new TableColumn({
    name: 'Description',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: true,
  })

  static readonly table = new Table({
    name: 'Permission',
    columns: [this.idColumn, this.actionColumn, this.descriptionColumn],
  })
}

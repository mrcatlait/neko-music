import { Table, TableColumn } from 'typeorm'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'

export class PermissionTable {
  static idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static descriptionColumn = new TableColumn({
    name: 'Description',
    length: '50',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

  static table = new Table({
    name: 'Permission',
    columns: [this.idColumn, this.descriptionColumn],
  })
}

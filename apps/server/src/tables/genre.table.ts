import { Table, TableColumn } from 'typeorm'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'

export class GenreTable {
  static readonly idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static readonly nameColumn = new TableColumn({
    name: 'Name',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

  static readonly table = new Table({
    name: 'Genre',
    columns: [this.idColumn, this.nameColumn],
  })
}

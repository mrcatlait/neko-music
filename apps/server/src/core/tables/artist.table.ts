import { Table, TableColumn } from 'typeorm'

import { CharacterTypes, UUIDGenerator, UUIDType } from '@core/models'

export class ArtistTable {
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

  static readonly bioColumn = new TableColumn({
    name: 'Bio',
    type: CharacterTypes.text,
    isNullable: true,
  })

  static readonly table = new Table({
    name: 'Artist',
    columns: [this.idColumn, this.nameColumn, this.bioColumn],
  })
}

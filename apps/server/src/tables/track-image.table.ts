import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { TrackTable } from './track.table'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'

export class TrackImageTable {
  static readonly idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static readonly trackIdForeignKey = new TableForeignKey({
    columnNames: ['TrackId'],
    referencedTableName: TrackTable.table.name,
    referencedColumnNames: [TrackTable.idColumn.name],
  })

  static readonly trackIdColumn = new TableColumn({
    name: 'TrackId',
    type: UUIDType,
    foreignKeyConstraintName: this.trackIdForeignKey.name,
    isNullable: false,
  })

  static readonly resolutionColumn = new TableColumn({
    name: 'Resolution',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
  })

  static readonly urlColumn = new TableColumn({
    name: 'Url',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'TrackImage',
    columns: [this.idColumn, this.trackIdColumn, this.resolutionColumn, this.urlColumn],
    foreignKeys: [this.trackIdForeignKey],
  })
}

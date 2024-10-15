import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { ArtistTable } from './artist.table'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'

export class ArtistImageTable {
  static readonly idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static readonly artistIdForeignKey = new TableForeignKey({
    columnNames: ['ArtistId'],
    referencedTableName: ArtistTable.table.name,
    referencedColumnNames: [ArtistTable.idColumn.name],
  })

  static readonly artistIdColumn = new TableColumn({
    name: 'ArtistId',
    type: UUIDType,
    foreignKeyConstraintName: this.artistIdForeignKey.name,
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
    name: 'ArtistImage',
    columns: [this.idColumn, this.artistIdColumn, this.resolutionColumn, this.urlColumn],
    foreignKeys: [this.artistIdForeignKey],
  })
}

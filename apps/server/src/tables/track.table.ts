import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { AlbumTable } from './album.table'

import { UUIDType, UUIDGenerator, CharacterTypes, DateTimeTypes, NumericTypes } from '@common/constants'

export class TrackTable {
  static readonly idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static readonly titleColumn = new TableColumn({
    name: 'Title',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

  static readonly releaseDateColumn = new TableColumn({
    name: 'ReleaseDate',
    type: DateTimeTypes.date,
    isNullable: false,
  })

  static readonly albumIdForeignKey = new TableForeignKey({
    columnNames: ['AlbumId'],
    referencedTableName: AlbumTable.table.name,
    referencedColumnNames: [AlbumTable.idColumn.name],
  })

  static readonly albumIdColumn = new TableColumn({
    name: 'AlbumId',
    type: UUIDType,
    foreignKeyConstraintName: this.albumIdForeignKey.name,
    isNullable: true,
  })

  static readonly durationColumn = new TableColumn({
    name: 'Duration',
    type: NumericTypes.smallint,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'Track',
    columns: [this.idColumn, this.titleColumn, this.releaseDateColumn, this.albumIdColumn, this.durationColumn],
    foreignKeys: [this.albumIdForeignKey],
  })
}

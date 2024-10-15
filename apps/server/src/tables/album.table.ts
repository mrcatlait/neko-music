import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { ArtistTable } from './artist.table'

import { UUIDType, UUIDGenerator, CharacterTypes, DateTimeTypes } from '@common/constants'

export class AlbumTable {
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

  static readonly releaseDateColumn = new TableColumn({
    name: 'ReleaseDate',
    type: DateTimeTypes.date,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'Album',
    columns: [this.idColumn, this.titleColumn, this.artistIdColumn, this.releaseDateColumn],
    foreignKeys: [this.artistIdForeignKey],
  })
}

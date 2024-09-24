import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { AlbumTable } from './album.table'

import { CharacterTypes, UUIDGenerator, UUIDType } from '@core/models'

export class AlbumImageTable {
  static readonly idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
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
    isNullable: false,
  })

  static readonly resolutionColumn = new TableColumn({
    name: 'Resolution',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
  })

  static readonly imageUrlColumn = new TableColumn({
    name: 'ImageUrl',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'AlbumImage',
    columns: [this.idColumn, this.albumIdColumn, this.resolutionColumn, this.imageUrlColumn],
    foreignKeys: [this.albumIdForeignKey],
  })
}

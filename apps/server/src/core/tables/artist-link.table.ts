import { Table, TableColumn, TableForeignKey, TableUnique } from 'typeorm'

import { ArtistTable } from './artist.table'

import { CharacterTypes, UUIDGenerator, UUIDType } from '@core/models'
import { ArtistLink } from '@features/artist/models'

export class ArtistLinkTable {
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

  static readonly typeColumn = new TableColumn({
    name: 'Type',
    type: CharacterTypes.varchar,
    length: '100',
    isNullable: false,
    enum: [ArtistLink.YOUTUBE, ArtistLink.SOUNDCLOUD],
  })

  static readonly urlColumn = new TableColumn({
    name: 'Url',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: false,
    isUnique: true,
  })

  static readonly artistAndTypeUnique = new TableUnique({
    columnNames: [this.artistIdColumn.name, this.typeColumn.name],
  })

  static readonly table = new Table({
    name: 'ArtistLink',
    columns: [this.idColumn, this.artistIdColumn, this.typeColumn, this.urlColumn],
    foreignKeys: [this.artistIdForeignKey],
    uniques: [this.artistAndTypeUnique],
  })
}

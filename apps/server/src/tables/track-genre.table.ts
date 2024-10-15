import { Table, TableColumn, TableForeignKey, TableUnique } from 'typeorm'

import { TrackTable } from './track.table'
import { GenreTable } from './genre.table'

import { UUIDType, UUIDGenerator } from '@common/constants'

export class TrackGenreTable {
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

  static readonly genreIdForeignKey = new TableForeignKey({
    columnNames: ['GenreId'],
    referencedTableName: GenreTable.table.name,
    referencedColumnNames: [GenreTable.idColumn.name],
  })

  static readonly genreIdColumn = new TableColumn({
    name: 'GenreId',
    type: UUIDType,
    foreignKeyConstraintName: this.trackIdForeignKey.name,
    isNullable: false,
  })

  static readonly trackAndGenreUnique = new TableUnique({
    columnNames: [this.trackIdColumn.name, this.genreIdColumn.name],
  })

  static readonly table = new Table({
    name: 'TrackGenre',
    columns: [this.idColumn, this.trackIdColumn, this.genreIdColumn],
    foreignKeys: [this.trackIdForeignKey, this.genreIdForeignKey],
    uniques: [this.trackAndGenreUnique],
  })
}

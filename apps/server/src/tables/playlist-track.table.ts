import { Table, TableColumn, TableForeignKey } from 'typeorm'

import { TrackTable } from './track.table'
import { PlaylistTable } from './playlist.table'

import { UUIDType, UUIDGenerator, NumericTypes } from '@common/constants'

export class PlaylistTrackTable {
  static readonly idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static readonly playlistIdForeignKey = new TableForeignKey({
    columnNames: ['PlaylistId'],
    referencedTableName: PlaylistTable.table.name,
    referencedColumnNames: [PlaylistTable.idColumn.name],
  })

  static readonly playlistIdColumn = new TableColumn({
    name: 'PlaylistId',
    type: UUIDType,
    foreignKeyConstraintName: this.playlistIdForeignKey.name,
    isNullable: false,
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

  static readonly positionColumn = new TableColumn({
    name: 'Position',
    type: NumericTypes.integer,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'PlaylistTrack',
    columns: [this.idColumn, this.playlistIdColumn, this.trackIdColumn, this.positionColumn],
    foreignKeys: [this.playlistIdForeignKey, this.trackIdForeignKey],
  })
}

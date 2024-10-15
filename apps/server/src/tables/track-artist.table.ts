import { Table, TableColumn, TableForeignKey, TableUnique } from 'typeorm'

import { ArtistTable } from './artist.table'
import { TrackTable } from './track.table'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'
import { ArtistRole } from '@modules/artist/constants'

export class TrackArtistTable {
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

  static readonly roleColumn = new TableColumn({
    name: 'Role',
    type: CharacterTypes.varchar,
    length: '100',
    isNullable: false,
    enum: [ArtistRole.FEATUREING, ArtistRole.PRIMARY, ArtistRole.PRODUCER, ArtistRole.REMIXER],
  })

  static readonly trackAndArtistAndRoleUnique = new TableUnique({
    columnNames: [this.trackIdColumn.name, this.artistIdColumn.name, this.roleColumn.name],
  })

  static readonly table = new Table({
    name: 'TrackArtist',
    columns: [this.idColumn, this.artistIdColumn, this.trackIdColumn, this.roleColumn],
    foreignKeys: [this.artistIdForeignKey, this.trackIdForeignKey],
    uniques: [this.trackAndArtistAndRoleUnique],
  })
}

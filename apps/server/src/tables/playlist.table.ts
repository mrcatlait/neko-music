import { Table, TableColumn } from 'typeorm'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'
import { PlaylistType } from '@modules/playlist/constants'

export class PlaylistTable {
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
  })

  static readonly typeColumn = new TableColumn({
    name: 'Type',
    type: CharacterTypes.varchar,
    length: '100',
    isNullable: false,
    enum: [PlaylistType.PRIVATE, PlaylistType.PUBLIC, PlaylistType.FEATURED],
  })

  static readonly userIdColumn = new TableColumn({
    name: 'UserId',
    type: CharacterTypes.varchar,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'Playlist',
    columns: [this.idColumn, this.nameColumn, this.typeColumn, this.userIdColumn],
  })
}

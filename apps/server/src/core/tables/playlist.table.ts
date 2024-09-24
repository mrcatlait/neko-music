import { Table, TableColumn } from 'typeorm'

import { CharacterTypes, UUIDGenerator, UUIDType } from '@core/models'
import { Privacy } from '@features/playlist/models'

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

  static readonly privacyColumn = new TableColumn({
    name: 'Privacy',
    type: CharacterTypes.varchar,
    length: '100',
    isNullable: false,
    enum: [Privacy.PRIVATE, Privacy.PUBLIC, Privacy.FEATURED],
  })

  static readonly userIdColumn = new TableColumn({
    name: 'UserId',
    type: CharacterTypes.varchar,
    isNullable: false,
  })

  static readonly table = new Table({
    name: 'Playlist',
    columns: [this.idColumn, this.nameColumn, this.privacyColumn, this.userIdColumn],
  })
}

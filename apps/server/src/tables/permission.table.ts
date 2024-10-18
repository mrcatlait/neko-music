import { Table, TableColumn } from 'typeorm'
import { PermissionAction, PermissionGroup, PermissionType } from '@neko/permissions'

import { UUIDType, UUIDGenerator, CharacterTypes } from '@common/constants'
export class PermissionTable {
  static idColumn = new TableColumn({
    name: 'Id',
    type: UUIDType,
    default: UUIDGenerator,
    isNullable: false,
    isUnique: true,
    isPrimary: true,
  })

  static actionColumn = new TableColumn({
    name: 'Action',
    length: '50',
    type: CharacterTypes.varchar,
    isNullable: false,
    enum: Object.values(PermissionAction),
  })

  static groupColumn = new TableColumn({
    name: 'Group',
    length: '50',
    type: CharacterTypes.varchar,
    isNullable: false,
    enum: Object.values(PermissionGroup),
  })

  static readonly typeColumn = new TableColumn({
    name: 'Type',
    type: CharacterTypes.varchar,
    length: '20',
    isNullable: false,
    enum: Object.values(PermissionType),
  })

  static descriptionColumn = new TableColumn({
    name: 'Description',
    length: '255',
    type: CharacterTypes.varchar,
    isNullable: true,
  })

  static table = new Table({
    name: 'Permission',
    columns: [this.idColumn, this.actionColumn, this.groupColumn, this.typeColumn, this.descriptionColumn],
  })
}

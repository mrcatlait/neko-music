import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import { PermissionAction, PermissionGroup, PermissionType } from '@neko/permissions'

import { UserRoleEntity } from './user-role.entity'

import { PermissionTable } from '@tables'
import { UtilsService } from '@shared/services'

@Entity({ name: PermissionTable.table.name })
export class PermissionEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(PermissionTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(PermissionTable.actionColumn))
  action: PermissionAction

  @Column(UtilsService.toColumnOptions(PermissionTable.typeColumn))
  type: PermissionType

  @Column(UtilsService.toColumnOptions(PermissionTable.groupColumn))
  group: PermissionGroup

  @Column(UtilsService.toColumnOptions(PermissionTable.descriptionColumn))
  description: string

  @ManyToMany(() => UserRoleEntity, (role) => role.permissions)
  roles: UserRoleEntity[]
}

import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'

import { UserRoleEntity } from './user-role.entity'

import { PermissionTable } from '@tables'
import { UtilsService } from '@shared/services'

@Entity({ name: PermissionTable.table.name })
export class PermissionEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(PermissionTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(PermissionTable.actionColumn))
  action: string

  @Column(UtilsService.toColumnOptions(PermissionTable.descriptionColumn))
  description: string

  @ManyToMany(() => UserRoleEntity, (role) => role.permissions)
  roles: UserRoleEntity[]
}

import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm'

import { PermissionEntity } from './permission.entity'

import { GrantedPermissionTable, UserRoleTable } from '@tables'
import { UtilsService } from '@shared/services'

@Entity({ name: UserRoleTable.table.name })
export class UserRoleEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(UserRoleTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(UserRoleTable.nameColumn))
  name: string

  @Column(UtilsService.toColumnOptions(UserRoleTable.descriptionColumn))
  description: string

  @Column(UtilsService.toColumnOptions(UserRoleTable.defaultColumn))
  default: boolean

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: GrantedPermissionTable.table.name,
    joinColumn: { name: GrantedPermissionTable.roleIdColumn.name, referencedColumnName: 'id' },
    inverseJoinColumn: { name: GrantedPermissionTable.permissionIdColumn.name, referencedColumnName: 'id' },
  })
  permissions?: PermissionEntity[]
}

import { Column, Entity, PrimaryColumn } from 'typeorm'

import { GrantedPermissionTable } from '@tables'
import { UtilsService } from '@shared/services'

@Entity({ name: GrantedPermissionTable.table.name })
export class GrantedPermissionEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(GrantedPermissionTable.roleIdColumn))
  roleId: string

  @Column(UtilsService.toColumnOptions(GrantedPermissionTable.permissionIdColumn))
  permissionId: string
}

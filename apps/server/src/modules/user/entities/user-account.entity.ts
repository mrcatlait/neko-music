import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { UserLoginDataEntity } from './user-login-data.entity'

import { UtilsService } from '@shared/services'
import { UserAccountTable } from '@tables'
import { UserRoleEntity } from '@modules/authorization/entities'

@Entity({ name: UserAccountTable.table.name })
export class UserAccountEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(UserAccountTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(UserAccountTable.usernameColumn))
  username: string

  @OneToOne(() => UserRoleEntity)
  @JoinColumn({ name: UserAccountTable.roleIdColumn.name, referencedColumnName: 'id' })
  role: UserRoleEntity

  @OneToOne(() => UserLoginDataEntity, (userLoginData) => userLoginData.userAccount, { onDelete: 'CASCADE' })
  userLoginData: UserLoginDataEntity
}

import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm'

import { UserLoginDataEntity } from './user-login-data.entity'

import { UserAccountTable } from '@core/tables'
import { UtilsService } from '@core/services'

@Entity({ name: UserAccountTable.table.name })
export class UserAccountEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(UserAccountTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(UserAccountTable.usernameColumn))
  username: string

  @OneToOne(() => UserLoginDataEntity, (userLoginData) => userLoginData.userAccount)
  userLoginData: UserLoginDataEntity
}

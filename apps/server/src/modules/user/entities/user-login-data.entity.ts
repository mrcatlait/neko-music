import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { UserAccountEntity } from './user-account.entity'

import { UtilsService } from '@core/services'
import { UserLoginDataTable } from '@core/tables'

@Entity({ name: UserLoginDataTable.table.name })
export class UserLoginDataEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(UserLoginDataTable.userIdColumn))
  userId: string

  @Column(UtilsService.toColumnOptions(UserLoginDataTable.emailColumn))
  email: string

  @Column(UtilsService.toColumnOptions(UserLoginDataTable.passwordHashColumn))
  passwordHash: string

  @Column(UtilsService.toColumnOptions(UserLoginDataTable.passwordSaltColumn))
  passwordSalt: string

  @OneToOne(() => UserAccountEntity, (userAccount) => userAccount.userLoginData)
  @JoinColumn(UserLoginDataTable.userIdColumn)
  userAccount: UserAccountEntity
}

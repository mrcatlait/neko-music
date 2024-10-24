import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Relation } from 'typeorm'

import { UserAccountEntity } from './user-account.entity'

import { UtilsService } from '@shared/services'
import { UserLoginDataTable } from '@tables'

@Entity({ name: UserLoginDataTable.table.name })
export class UserLoginDataEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(UserLoginDataTable.userIdColumn))
  userId: string

  @Column(UtilsService.toColumnOptions(UserLoginDataTable.emailColumn))
  email: string

  @Column(UtilsService.toColumnOptions(UserLoginDataTable.passwordHashColumn))
  passwordHash: string

  @OneToOne(() => UserAccountEntity, (userAccount) => userAccount.userLoginData)
  @JoinColumn(UserLoginDataTable.userIdColumn)
  userAccount: Relation<UserAccountEntity>
}

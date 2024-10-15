import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { RefreshTokenTable } from '@core/tables'
import { UtilsService } from '@core/services'

@Entity({ name: RefreshTokenTable.table.name })
export class RefreshTokenEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(RefreshTokenTable.refreshTokenColumn))
  refreshToken: string

  @Column(UtilsService.toColumnOptions(RefreshTokenTable.expiresAtColumn))
  expiresAt: Date

  @Column(UtilsService.toColumnOptions(RefreshTokenTable.userIdColumn))
  userId: string

  // @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: RefreshTokenTable.userIdColumn.name, referencedColumnName: 'id' })
  // user: UserEntity
}

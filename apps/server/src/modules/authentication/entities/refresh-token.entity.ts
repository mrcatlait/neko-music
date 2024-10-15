import { Column, Entity, PrimaryColumn } from 'typeorm'

import { UtilsService } from '@shared/services'
import { RefreshTokenTable } from '@tables'

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

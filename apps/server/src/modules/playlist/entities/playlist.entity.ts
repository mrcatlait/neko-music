import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm'

import { PlaylistDto } from '../dto'
import { PlaylistType } from '../constants'

import { PlaylistTable, PlaylistTrackTable } from '@tables'
import { UtilsService } from '@shared/services'
import { AbstractEntity } from '@common/entities'
import { TrackEntity } from '@modules/track/entities'

@Entity({ name: PlaylistTable.table.name })
export class PlaylistEntity extends AbstractEntity<PlaylistDto> {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(PlaylistTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(PlaylistTable.nameColumn))
  name: string

  @Column(UtilsService.toColumnOptions(PlaylistTable.typeColumn))
  type: PlaylistType

  @Column(UtilsService.toColumnOptions(PlaylistTable.userIdColumn))
  userId: string

  @ManyToMany(() => TrackEntity, { onDelete: 'CASCADE' })
  @JoinTable({
    name: PlaylistTrackTable.table.name,
    joinColumn: { name: PlaylistTrackTable.trackIdColumn.name, referencedColumnName: 'id' },
    inverseJoinColumn: { name: PlaylistTrackTable.playlistIdColumn.name, referencedColumnName: 'id' },
  })
  tracks?: TrackEntity[]

  dtoClass = PlaylistDto
}

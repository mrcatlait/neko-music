import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm'

import { Privacy } from '../models'
import { PlaylistDto } from '../dto'

import { AbstractEntity } from '@core/entities'
import { PlaylistTable, PlaylistTrackTable } from '@core/tables'
import { UtilsService } from '@core/services'
import { TrackEntity } from '@features/track/entities'

@Entity({ name: PlaylistTable.table.name })
export class PlaylistEntity extends AbstractEntity<PlaylistDto> {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(PlaylistTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(PlaylistTable.nameColumn))
  name: string

  @Column(UtilsService.toColumnOptions(PlaylistTable.privacyColumn))
  privacy: Privacy

  @Column(UtilsService.toColumnOptions(PlaylistTable.userIdColumn))
  userId: string

  @ManyToMany(() => TrackEntity)
  @JoinTable({
    name: PlaylistTrackTable.table.name,
    joinColumn: { name: PlaylistTrackTable.trackIdColumn.name, referencedColumnName: 'id' },
    inverseJoinColumn: { name: PlaylistTrackTable.playlistIdColumn.name, referencedColumnName: 'id' },
  })
  tracks: TrackEntity[]

  dtoClass = PlaylistDto
}

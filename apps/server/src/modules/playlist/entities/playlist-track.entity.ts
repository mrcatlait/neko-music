import { Column, Entity, PrimaryColumn } from 'typeorm'

import { UtilsService } from '@shared/services'
import { PlaylistTrackTable } from '@tables'

@Entity({ name: PlaylistTrackTable.table.name })
export class PlaylistTrackEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(PlaylistTrackTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(PlaylistTrackTable.playlistIdColumn))
  playlistId: string

  @Column(UtilsService.toColumnOptions(PlaylistTrackTable.trackIdColumn))
  trackId: string

  @Column(UtilsService.toColumnOptions(PlaylistTrackTable.positionColumn))
  position: number
}

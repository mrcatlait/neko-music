import { Column, Entity, PrimaryColumn } from 'typeorm'

import { PlaylistTrackTable } from '@core/tables'
import { UtilsService } from '@core/services'

@Entity({ name: PlaylistTrackTable.table.name })
export class PlaylistTrackEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(PlaylistTrackTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(PlaylistTrackTable.playlistIdColumn))
  playlistId: string

  @Column(UtilsService.toColumnOptions(PlaylistTrackTable.trackIdColumn))
  trackId: string
}

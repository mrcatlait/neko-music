import { Column, Entity, PrimaryColumn } from 'typeorm'

import { TrackGenreTable } from '@tables'
import { UtilsService } from '@shared/services'

@Entity({ name: TrackGenreTable.table.name })
export class TrackGenreEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(TrackGenreTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(TrackGenreTable.trackIdColumn))
  trackId: string

  @Column(UtilsService.toColumnOptions(TrackGenreTable.genreIdColumn))
  genreId: string
}

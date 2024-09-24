import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { TrackEntity } from './track.entity'

import { UtilsService } from '@core/services'
import { TrackImageTable } from '@core/tables'

@Entity({ name: TrackImageTable.table.name })
export class TrackImageEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(TrackImageTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(TrackImageTable.trackIdColumn))
  trackId: string

  @Column(UtilsService.toColumnOptions(TrackImageTable.resolutionColumn))
  resolution: string

  @Column(UtilsService.toColumnOptions(TrackImageTable.urlColumn))
  url: string

  @ManyToOne(() => TrackEntity, (track) => track.images)
  @JoinColumn({ name: TrackImageTable.trackIdColumn.name, referencedColumnName: 'id' })
  track: TrackEntity
}

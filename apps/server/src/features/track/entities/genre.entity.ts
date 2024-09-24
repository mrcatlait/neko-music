import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'

import { TrackEntity } from './track.entity'

import { GenreTable } from '@core/tables'
import { UtilsService } from '@core/services'

@Entity({ name: GenreTable.table.name })
export class GenreEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(GenreTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(GenreTable.nameColumn))
  name: string

  @ManyToMany(() => TrackEntity, (track) => track.genres)
  tracks: TrackEntity[]
}

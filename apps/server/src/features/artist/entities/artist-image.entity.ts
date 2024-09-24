import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ArtistEntity } from './artist.entity'

import { UtilsService } from '@core/services'
import { ArtistImageTable } from '@core/tables'

@Entity({ name: ArtistImageTable.table.name })
export class ArtistImageEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(ArtistImageTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(ArtistImageTable.artistIdColumn))
  artistId: string

  @Column(UtilsService.toColumnOptions(ArtistImageTable.resolutionColumn))
  resolution: string

  @Column(UtilsService.toColumnOptions(ArtistImageTable.urlColumn))
  url: string

  @ManyToOne(() => ArtistEntity, (artist) => artist.images)
  @JoinColumn({ name: ArtistImageTable.artistIdColumn.name, referencedColumnName: 'id' })
  artist: ArtistEntity
}

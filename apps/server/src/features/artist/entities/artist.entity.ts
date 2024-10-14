import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'

import { ArtistImageEntity } from './artist-image.entity'
import { ArtistDto } from '../dto'

import { AbstractEntity } from '@core/entities'
import { TrackEntity } from '@features/track/entities'
import { ArtistTable } from '@core/tables'
import { UtilsService } from '@core/services'

@Entity({ name: ArtistTable.table.name })
export class ArtistEntity extends AbstractEntity<ArtistDto> {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(ArtistTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(ArtistTable.nameColumn))
  name: string

  @OneToMany(() => ArtistImageEntity, (image) => image.artist)
  images?: ArtistImageEntity[]

  @Column(UtilsService.toColumnOptions(ArtistTable.bioColumn))
  bio?: string

  @ManyToMany(() => TrackEntity, (track) => track.artists)
  tracks?: TrackEntity[]

  dtoClass = ArtistDto
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from 'typeorm'

import { ArtistLink } from '../models'
import { ArtistEntity } from './artist.entity'

import { ArtistLinkTable } from '@core/tables'
import { UtilsService } from '@core/services'

@Entity({ name: ArtistLinkTable.table.name })
export class ArtistLinkEntity {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(ArtistLinkTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(ArtistLinkTable.artistIdColumn))
  artistId: string

  @Column(UtilsService.toColumnOptions(ArtistLinkTable.typeColumn))
  type: ArtistLink

  @Column(UtilsService.toColumnOptions(ArtistLinkTable.urlColumn))
  url: string

  @ManyToOne(() => ArtistEntity, (artist) => artist.links)
  @JoinColumn({ name: ArtistLinkTable.artistIdColumn.name, referencedColumnName: 'id' })
  artist: Relation<ArtistEntity>
}

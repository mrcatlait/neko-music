import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { TrackEntity } from './track.entity'
import { TrackArtistDto } from '../dto'

import { UtilsService } from '@core/services'
import { TrackArtistTable } from '@core/tables'
import { ArtistRole } from '@features/artist/models'
import { ArtistEntity } from '@features/artist/entities'
import { AbstractEntity } from '@core/entities'

@Entity({ name: TrackArtistTable.table.name })
export class TrackArtistEntity extends AbstractEntity<TrackArtistDto> {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(TrackArtistTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(TrackArtistTable.trackIdColumn))
  trackId: string

  @Column(UtilsService.toColumnOptions(TrackArtistTable.artistIdColumn))
  artistId: string

  @Column(UtilsService.toColumnOptions(TrackArtistTable.roleColumn))
  role: ArtistRole

  @ManyToOne(() => ArtistEntity)
  @JoinColumn({ name: TrackArtistTable.artistIdColumn.name, referencedColumnName: 'id' })
  artist: ArtistEntity

  @ManyToOne(() => TrackEntity)
  @JoinColumn({ name: TrackArtistTable.trackIdColumn.name, referencedColumnName: 'id' })
  track: TrackEntity

  dtoClass = TrackArtistDto
}

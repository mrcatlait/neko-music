import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { TrackArtistDto } from '../dto'
import { TrackEntity } from './track.entity'

import { TrackArtistTable } from '@tables'
import { UtilsService } from '@shared/services'
import { AbstractEntity } from '@common/entities'
import { ArtistEntity } from '@modules/artist/entities'
import { ArtistRole } from '@modules/artist/constants'

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

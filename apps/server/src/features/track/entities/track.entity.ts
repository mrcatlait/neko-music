import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'

import { GenreEntity } from './genre.entity'
import { TrackDto } from '../dto'
import { TrackImageEntity } from './track-image.entity'
import { TrackArtistEntity } from './track-artist.entity'

import { AbstractEntity } from '@core/entities'
import { TrackGenreTable, TrackTable } from '@core/tables'
import { UtilsService } from '@core/services'

@Entity({ name: TrackTable.table.name })
export class TrackEntity extends AbstractEntity<TrackDto> {
  @PrimaryColumn(UtilsService.toPrimaryColumnOptions(TrackTable.idColumn))
  id: string

  @Column(UtilsService.toColumnOptions(TrackTable.durationColumn))
  duration: number

  @Column(UtilsService.toColumnOptions(TrackTable.titleColumn))
  title: string

  @Column(UtilsService.toColumnOptions(TrackTable.releaseDateColumn))
  releaseDate: Date

  @OneToMany(() => TrackImageEntity, (image) => image.track)
  images: TrackImageEntity[]

  @ManyToMany(() => GenreEntity, (genre) => genre.tracks)
  @JoinTable({
    name: TrackGenreTable.table.name,
    joinColumn: { name: TrackGenreTable.trackIdColumn.name, referencedColumnName: 'id' },
    inverseJoinColumn: { name: TrackGenreTable.genreIdColumn.name, referencedColumnName: 'id' },
  })
  genres?: GenreEntity[]

  @OneToMany(() => TrackArtistEntity, (artist) => artist.track)
  artists: TrackArtistEntity[]

  dtoClass = TrackDto
}

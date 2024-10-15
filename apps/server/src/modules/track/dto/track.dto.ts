import { ApiProperty } from '@nestjs/swagger'

import { TrackEntity } from '../entities'
import { TrackArtistDto } from './track-artist.dto'

import { ImageDto } from '@common/dto'

export class TrackDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty({ type: () => Number })
  readonly duration: number

  @ApiProperty()
  readonly title: string

  @ApiProperty({ type: () => [TrackArtistDto] })
  readonly artists: TrackArtistDto[]

  @ApiProperty({ type: () => [ImageDto] })
  readonly images: ImageDto[]

  @ApiProperty({ type: () => [String] })
  readonly genres?: string[]

  constructor(track: TrackEntity) {
    this.id = track.id
    this.title = track.title
    this.duration = track.duration
    this.genres = track.genres?.map((genre) => genre.name)
    this.images = track.images.map((image) => ({
      resolution: image.resolution,
      url: image.url,
    }))
    this.artists = track.artists.toDtos()
  }
}

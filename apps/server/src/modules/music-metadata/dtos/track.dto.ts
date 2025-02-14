import { ApiProperty } from '@nestjs/swagger'

import { TrackArtistDto } from './track-artist.dto'

import { ImageDto } from '@modules/shared/dtos'

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
}

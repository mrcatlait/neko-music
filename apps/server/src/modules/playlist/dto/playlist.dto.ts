import { ApiProperty } from '@nestjs/swagger'

import { PlaylistEntity } from '../entities'
import { PlaylistType } from '../constants'

import { TrackDto } from '@modules/track/dto'

export class PlaylistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty({
    enum: PlaylistType,
  })
  readonly type: PlaylistType

  @ApiProperty({ type: () => [TrackDto] })
  readonly tracks: TrackDto[]

  constructor(playlist: PlaylistEntity) {
    this.id = playlist.id
    this.name = playlist.name
    this.type = playlist.type
    this.tracks = playlist.tracks?.toDtos() ?? []
  }
}

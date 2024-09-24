import { ApiProperty } from '@nestjs/swagger'

import { Privacy } from '../models'
import { PlaylistEntity } from '../entities'

import { TrackDto } from '@features/track/dto'

export class PlaylistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty({
    enum: Privacy,
  })
  readonly privacy: Privacy

  @ApiProperty({ type: () => [TrackDto] })
  readonly tracks: TrackDto[]

  constructor(playlist: PlaylistEntity) {
    this.id = playlist.id
    this.name = playlist.name
    this.privacy = playlist.privacy
    this.tracks = playlist.tracks.toDtos()
  }
}

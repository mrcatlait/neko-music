import { ApiProperty } from '@nestjs/swagger'

import { TrackArtistEntity } from '../entities'

export class TrackArtistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty()
  readonly role: string

  constructor(trackArtist: TrackArtistEntity) {
    this.id = trackArtist.artist.id
    this.name = trackArtist.artist.name
    this.role = trackArtist.role
  }
}

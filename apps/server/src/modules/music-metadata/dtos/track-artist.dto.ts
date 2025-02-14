import { ApiProperty } from '@nestjs/swagger'

import { ArtistRole } from '@modules/music-metadata/enums'

export class TrackArtistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty({ enum: ArtistRole })
  readonly role: ArtistRole
}

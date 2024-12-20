import { ApiProperty } from '@nestjs/swagger'

import { ArtistRole } from '@modules/artist/enums'

export class TrackArtistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty({ enum: ArtistRole })
  readonly role: ArtistRole
}

import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { ArtistDto } from './artist.dto'

export class ArtistsResponse implements Contracts.Backstage.Artists.ArtistsResponse {
  @ApiProperty({
    description: 'The artists',
    type: [ArtistDto],
  })
  data: ArtistDto[]
}

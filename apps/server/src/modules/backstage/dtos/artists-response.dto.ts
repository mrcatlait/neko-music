import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { Artist } from './artist.dto'

export class ArtistsResponse implements Contracts.Backstage.ArtistsResponse {
  @ApiProperty({
    description: 'The artists',
    type: [Artist],
  })
  data: Artist[]
}

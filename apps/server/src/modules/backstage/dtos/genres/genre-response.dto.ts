import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { Genre } from './genre.dto'

export class GenreResponse implements Contracts.Backstage.GenreResponse {
  @ApiProperty({
    description: 'The genre',
    type: Genre,
  })
  data: Genre
}

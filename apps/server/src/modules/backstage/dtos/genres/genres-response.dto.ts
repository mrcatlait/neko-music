import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { Genre } from './genre.dto'

export class GenresResponse implements Contracts.Backstage.Genres.GenresResponse {
  @ApiProperty({
    description: 'The genre',
    type: Genre,
  })
  data: Genre[]
}

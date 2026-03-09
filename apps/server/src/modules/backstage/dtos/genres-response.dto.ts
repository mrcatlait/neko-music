import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { Genre } from './genre.dto'

export class GenresResponse implements Contracts.Backstage.GenresResponse {
  @ApiProperty({
    description: 'The genre',
    type: Genre,
  })
  data: Genre[]
}

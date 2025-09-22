import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { Genre } from './genre.dto'

export class GenresResponse implements Contracts.Backstage.GenresResponse {
  @ApiProperty({
    description: 'The genres',
    type: [Genre],
  })
  data: Genre[]
}

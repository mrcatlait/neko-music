import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class Genre implements Contracts.Backstage.Genre {
  @ApiProperty({
    description: 'The id of the genre',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The name of the genre',
    example: 'Rock',
  })
  name: string
}

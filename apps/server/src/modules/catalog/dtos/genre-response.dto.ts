import { ApiProperty } from '@nestjs/swagger'

export class GenreResponse {
  @ApiProperty({
    description: 'The id of the genre',
  })
  id: string

  @ApiProperty({
    description: 'The name of the genre',
  })
  name: string
}

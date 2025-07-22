import { ApiProperty } from '@nestjs/swagger'

export class GenreDto {
  @ApiProperty({
    description: 'The id of the genre',
  })
  id: string

  @ApiProperty({
    description: 'The name of the genre',
  })
  name: string
}

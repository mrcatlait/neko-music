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

  @ApiProperty({
    description: 'The created at date of the genre',
  })
  created_at: Date

  @ApiProperty({
    description: 'The updated at date of the genre',
  })
  updated_at: Date
}

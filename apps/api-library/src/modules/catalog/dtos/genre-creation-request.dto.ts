import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GenreCreationRequest {
  @ApiProperty({
    description: 'The name of the genre',
    example: 'Rock',
  })
  @IsString()
  @IsNotEmpty()
  name: string
}

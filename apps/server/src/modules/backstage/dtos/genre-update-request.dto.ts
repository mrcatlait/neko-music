import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GenreUpdateRequest implements Contracts.Backstage.GenreUpdateRequest {
  @ApiProperty({
    description: 'The name of the genre',
    example: 'Rock',
  })
  @IsString()
  @IsNotEmpty()
  name: string
}

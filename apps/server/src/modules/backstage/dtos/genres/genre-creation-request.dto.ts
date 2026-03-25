import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GenreCreationRequest implements Contracts.Backstage.GenreCreationRequest {
  @ApiProperty({
    description: 'The name of the genre',
    example: 'Rock',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The slug of the genre',
    example: 'rock',
  })
  @IsString()
  @IsNotEmpty()
  slug: string
}

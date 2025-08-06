import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsUUID } from 'class-validator'

export class CreateArtistDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the artist',
    example: 'John Doe',
  })
  name: string

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the artist is verified',
    example: true,
  })
  verified: boolean

  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'The IDs of the genres of the artist',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  genres: string[]
}

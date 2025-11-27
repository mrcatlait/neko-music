import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ArtistCreationRequest implements Contracts.Backstage.ArtistCreationRequest {
  @ApiProperty({
    description: 'The name of the artist',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The IDs of the genres of the artist',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  genres: string[]

  @ApiProperty({
    description: 'The artwork of the artist',
    type: 'string',
    format: 'binary',
  })
  artwork: string

  @ApiProperty({
    description: 'Whether the artist is verified',
    example: true,
  })
  @IsBoolean()
  verified: boolean
}

import { ApiProperty } from '@nestjs/swagger'

import { ArtworkDto } from './artwork.dto'

export class ArtistDto {
  @ApiProperty({
    description: 'The id of the artist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The name of the artist',
    example: 'Queen',
  })
  name: string

  @ApiProperty({
    description: 'The verified status of the artist',
    example: true,
  })
  verified: boolean
}

export class ArtistWithArtworkDto extends ArtistDto {
  @ApiProperty({
    description: 'The artwork of the artist',
    type: ArtworkDto,
  })
  artwork: ArtworkDto
}

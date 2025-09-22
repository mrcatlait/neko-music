import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { ArtworkDto } from '@/modules/shared/dtos'

export class Artist implements Contracts.Backstage.Artist {
  @ApiProperty({
    description: 'The id of the artist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The name of the artist',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'The verified status of the artist',
    example: true,
  })
  verified: boolean

  @ApiProperty({
    description: 'The artwork of the artist',
    type: ArtworkDto,
  })
  artwork: ArtworkDto
}

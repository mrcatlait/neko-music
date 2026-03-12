import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

class ArtworkDto {
  @ApiProperty({
    description: 'Template URL with {size} placeholder',
    example: 'https://example.com/artwork/{size}.webp',
  })
  url: string

  @ApiProperty({
    description: 'Dominant color of the artwork',
    example: '#1a1a2e',
  })
  dominantColor: string
}

export class BackstageArtist implements Contracts.Backstage.BackstageArtist {
  @ApiProperty({
    description: 'The id of the artist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The name of the artist',
    example: 'The Beatles',
  })
  name: string

  @ApiProperty({
    description: 'Whether the artist is verified',
    example: true,
  })
  verified: boolean

  @ApiProperty({
    description: 'The publishing status',
    example: 'DRAFT',
    enum: ['DRAFT', 'PROCESSING', 'PUBLISHED', 'REJECTED'],
  })
  status: 'DRAFT' | 'PROCESSING' | 'PUBLISHED' | 'REJECTED'

  @ApiProperty({
    description: 'The IDs of the genres of the artist',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  genres: string[]

  @ApiProperty({
    description: 'The artwork, or null if not yet uploaded',
    type: ArtworkDto,
    nullable: true,
  })
  artwork: ArtworkDto | null
}

import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { PublishingStatus } from '../../enums'

import { ArtworkDto } from '@/modules/shared/dtos'

export class Artist implements Contracts.Backstage.Artists.Artist {
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
    example: PublishingStatus.Draft,
    enum: PublishingStatus,
  })
  status: PublishingStatus

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

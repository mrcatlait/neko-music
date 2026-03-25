import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { PublishingStatus } from '../../enums'

export class Genre implements Contracts.Backstage.Genre {
  @ApiProperty({
    description: 'The id of the genre',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The name of the genre',
    example: 'Rock',
  })
  name: string

  @ApiProperty({
    description: 'The slug of the genre',
    example: 'rock',
  })
  slug: string

  @ApiProperty({
    description: 'The status of the genre',
    example: PublishingStatus.Draft,
    enum: PublishingStatus,
  })
  status: PublishingStatus

  @ApiProperty({
    description: 'The timestamp of the genre creation',
    type: Date,
  })
  createdAt: Date

  @ApiProperty({
    description: 'The user who created the genre',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdBy: string

  @ApiProperty({
    description: 'The timestamp of the genre update',
    type: Date,
  })
  updatedAt: Date

  @ApiProperty({
    description: 'The user who updated the genre',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  updatedBy: string
}

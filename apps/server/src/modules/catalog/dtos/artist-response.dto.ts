import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { RecordStatus } from '../enums'

export class ArtistResponse implements Contracts.CatalogManagement.ArtistResponse {
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

  @ApiProperty({
    description: 'The status of the artist',
    enum: RecordStatus,
  })
  status: RecordStatus
}

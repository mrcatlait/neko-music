import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { TrackCreationResponse } from '../tracks'

export class AlbumCreationResponse implements Contracts.Backstage.Albums.CreationResponse {
  @ApiProperty({
    description: 'The ID of the album',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The upload token of the album',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uploadToken: string

  @ApiProperty({
    description: 'The tracks of the album',
    type: () => TrackCreationResponse,
    isArray: true,
  })
  tracks: TrackCreationResponse[]
}

import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

export class TrackCreationResponse implements Contracts.Backstage.Tracks.CreationResponse {
  @ApiProperty({
    description: 'The ID of the track',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The upload token of the track',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uploadToken: string
}

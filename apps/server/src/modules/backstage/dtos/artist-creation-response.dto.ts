import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class ArtistCreationResponse implements Contracts.Backstage.ArtistCreationResponse {
  @ApiProperty({
    description: 'The id of the artist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  artistId: string

  @ApiProperty({
    description: 'The upload token',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uploadToken: string
}

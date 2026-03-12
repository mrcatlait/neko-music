import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class ArtistUpdateResponse implements Contracts.Backstage.ArtistUpdateResponseDto {
  @ApiProperty({
    description: 'The upload token for replacing the artist artwork',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uploadToken: string
}

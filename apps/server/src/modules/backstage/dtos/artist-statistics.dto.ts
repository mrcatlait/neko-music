import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

export class ArtistStatistics implements Contracts.Backstage.ArtistStatistics {
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
    description: 'The publishing status of the artist',
    example: 'PUBLISHED',
  })
  status: string

  @ApiProperty({
    description: 'The total number of albums by the artist',
    example: 10,
  })
  totalAlbums: number

  @ApiProperty({
    description: 'The total number of tracks by the artist',
    example: 100,
  })
  totalTracks: number
}

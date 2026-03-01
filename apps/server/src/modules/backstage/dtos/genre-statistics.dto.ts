import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

export class GenreStatistics implements Contracts.Backstage.GenreStatistics {
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
    description: 'The total number of artists in the genre',
    example: 100,
  })
  totalArtists: number

  @ApiProperty({
    description: 'The total number of albums in the genre',
    example: 100,
  })
  totalAlbums: number

  @ApiProperty({
    description: 'The total number of tracks in the genre',
    example: 100,
  })
  totalTracks: number
}

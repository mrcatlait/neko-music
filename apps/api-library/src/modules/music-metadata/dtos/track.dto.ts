import { ApiProperty } from '@nestjs/swagger'

import { ArtistDto } from './artist.dto'
import { ArtworkDto } from './artwork.dto'

export class TrackDto {
  @ApiProperty({
    description: 'The title of the track',
    example: 'Bohemian Rhapsody',
  })
  title: string

  @ApiProperty({
    description: 'The track number of the track',
    example: 1,
  })
  trackNumber: number

  @ApiProperty({
    description: 'The disk number of the track',
    example: 1,
  })
  diskNumber: number

  @ApiProperty({
    description: 'The release date of the track',
    example: '2021-01-01',
  })
  releaseDate: Date

  @ApiProperty({
    description: 'The duration of the track',
    example: 300,
  })
  duration: number

  @ApiProperty({
    description: 'The album artwork',
    type: ArtworkDto,
  })
  artwork: ArtworkDto

  @ApiProperty({
    description: 'The primary artist of the track',
    type: ArtistDto,
  })
  primaryArtist: ArtistDto
}

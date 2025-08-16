import { ApiProperty } from '@nestjs/swagger'

export class TrackDto {
  @ApiProperty({
    description: 'The name of the track',
    example: 'Bohemian Rhapsody',
  })
  name: string

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
}

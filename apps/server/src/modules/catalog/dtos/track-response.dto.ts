import { ApiProperty } from '@nestjs/swagger'

export class TrackResponse {
  @ApiProperty({
    description: 'The ID of the track',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The name of the track',
    example: 'Time',
  })
  name: string

  @ApiProperty({
    description: 'The duration of the track',
    example: 216,
  })
  duration: number

  @ApiProperty({
    description: 'Whether the track has explicit content',
    example: false,
  })
  explicit: boolean

  @ApiProperty({
    description: 'The ID of the album of the track',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  albumId: string

  @ApiProperty({
    description: 'The release date of the track',
    example: '1973-02-12',
  })
  releaseDate: Date

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
}

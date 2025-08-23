import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDateString, IsNumber, IsString, IsUUID } from 'class-validator'

export class TrackCreationRequest {
  @IsString()
  @ApiProperty({
    description: 'The name of the track',
    example: 'Time',
  })
  name: string

  @IsNumber()
  @ApiProperty({
    description: 'The duration of the track',
    example: 216,
  })
  duration: number

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the track has explicit content',
    example: false,
  })
  explicit: boolean

  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'The genres of the track',
    example: ['Rock', 'Progressive Rock'],
  })
  genres: string[]

  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'The artists of the track',
    example: ['Pink Floyd'],
  })
  artists: string[]

  @IsUUID('4')
  @ApiProperty({
    description: 'The album of the track',
    example: 'The Dark Side of the Moon',
  })
  album: string

  @IsDateString()
  @ApiProperty({
    description: 'The release date of the track',
    example: '1973-02-12',
  })
  releaseDate: string

  @IsNumber()
  @ApiProperty({
    description: 'The disk number of the track',
    example: 1,
  })
  diskNumber: number

  @IsNumber()
  @ApiProperty({
    description: 'The track number of the track',
    example: 1,
  })
  trackNumber: number
}

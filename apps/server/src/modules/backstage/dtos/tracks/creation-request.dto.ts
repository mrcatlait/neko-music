import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator'

import { ArtistRole } from '@/modules/shared/dtos'
import { TrackType } from '@/modules/shared/enums'

export class TrackCreationRequest implements Contracts.Backstage.Tracks.CreationRequest {
  @ApiProperty({
    description: 'The name of the track',
    example: 'The Beatles',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The release date of the track',
    example: '2021-01-01',
  })
  @IsDateString()
  releaseDate: string

  @ApiProperty({
    description: 'The disk number of the track',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  diskNumber: number

  @ApiProperty({
    description: 'The track number of the track',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  trackNumber: number

  @ApiProperty({
    description: 'The type of the track',
    example: TrackType.Original,
    enum: TrackType,
  })
  @IsEnum(TrackType)
  @IsNotEmpty()
  type: TrackType

  @ApiProperty({
    description: 'Whether the track is explicit',
    example: true,
  })
  @IsBoolean()
  explicit: boolean

  @ApiProperty({
    description: 'The IDs of the genres of the track',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  genres: string[]

  @ApiProperty({
    description: 'The artists of the track',
    type: () => ArtistRole,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  artists: ArtistRole[]
}

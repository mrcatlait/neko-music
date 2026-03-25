import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsBoolean, IsUUID, ArrayNotEmpty, IsArray } from 'class-validator'

import { TrackCreationRequest } from '../tracks'

import { ArtistRole } from '@/modules/shared/dtos'
import { AlbumType } from '@/modules/shared/enums'

export class AlbumCreationRequest implements Contracts.Backstage.Albums.CreationRequest {
  @ApiProperty({
    description: 'The name of the album',
    example: 'The Beatles',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The release date of the album',
    example: '2021-01-01',
  })
  @IsDateString()
  releaseDate: string

  @ApiProperty({
    description: 'The type of the album',
    example: AlbumType.Album,
    enum: AlbumType,
  })
  @IsEnum(AlbumType)
  @IsNotEmpty()
  type: AlbumType

  @ApiProperty({
    description: 'Whether the album is explicit',
    example: true,
  })
  @IsBoolean()
  explicit: boolean

  @ApiProperty({
    description: 'The IDs of the genres of the album',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  genres: string[]

  @ApiProperty({
    description: 'The artists of the album',
    type: () => ArtistRole,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  artists: ArtistRole[]

  @ApiProperty({
    description: 'The tracks of the album',
    type: () => TrackCreationRequest,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  tracks: TrackCreationRequest[]
}

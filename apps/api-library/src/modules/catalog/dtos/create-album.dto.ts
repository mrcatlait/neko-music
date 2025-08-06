import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsUUID, IsDateString, IsEnum, IsArray } from 'class-validator'

import { AlbumType } from '../enums'

export class CreateAlbumDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the album',
    example: 'The Dark Side of the Moon',
  })
  name: string

  @IsDateString()
  @ApiProperty({
    description: 'The release date of the album',
    example: '1973-02-12',
  })
  releaseDate: string

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the album has explicit content',
    example: false,
  })
  explicit: boolean

  @IsEnum(AlbumType)
  @ApiProperty({
    description: 'The type of the album',
    enum: AlbumType,
    example: AlbumType.ALBUM,
  })
  type: AlbumType

  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'The IDs of the genres for the album',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  genres: string[]

  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'The IDs of the artists for the album',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  artists: string[]
}

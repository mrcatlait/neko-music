import { ApiProperty } from '@nestjs/swagger'

import { AlbumType } from '../enums'
import { ArtworkDto } from './artwork.dto'

export class AlbumWithArtistsDto {
  @ApiProperty({
    description: 'The id of the album',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The title of the album',
    example: 'The Dark Side of the Moon',
  })
  title: string

  @ApiProperty({
    description: 'The release date of the album',
    example: '1973-02-12',
  })
  release_date: Date

  @ApiProperty({
    description: 'The explicit flag of the album',
    example: true,
  })
  explicit: boolean

  @ApiProperty({
    description: 'The type of the album',
    enum: AlbumType,
    example: AlbumType.ALBUM,
  })
  type: AlbumType

  @ApiProperty({
    description: 'The artwork of the album',
    type: ArtworkDto,
  })
  artwork: ArtworkDto
}

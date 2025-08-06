import { ApiProperty } from '@nestjs/swagger'

import { AlbumType } from '../enums'
import { ArtworkDto } from './artwork.dto'
import { ArtistDto } from './artist.dto'

export class AlbumDto {
  @ApiProperty({
    description: 'The id of the album',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'The title of the album',
    example: 'The Dark Side of the Moon',
  })
  name: string

  @ApiProperty({
    description: 'The release date of the album',
    example: '1973-02-12',
  })
  releaseDate: Date

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
}

export class AlbumWithArtistsDto extends AlbumDto {
  @ApiProperty({
    description: 'The artists of the album',
    type: [ArtistDto],
  })
  artists: ArtistDto[]
}

export class AlbumWithArtistsAndArtworkDto extends AlbumWithArtistsDto {
  @ApiProperty({
    description: 'The artwork of the album',
    type: ArtworkDto,
  })
  artwork: ArtworkDto
}

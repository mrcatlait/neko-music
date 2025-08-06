import { ApiProperty } from '@nestjs/swagger'

import { ArtistDto } from './artist.dto'
import { ArtworkDto } from './artwork.dto'
import { AlbumType } from '../enums'

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

export class TrackWithAlbumAndArtistsAndArtworkDto extends TrackDto {
  @ApiProperty({
    description: 'The album name of the track',
    example: 'Bohemian Rhapsody',
  })
  albumName: string

  @ApiProperty({
    description: 'The album id of the track',
    example: '123',
  })
  albumId: string

  @ApiProperty({
    description: 'The album type of the track',
    example: AlbumType.ALBUM,
    enum: AlbumType,
  })
  albumType: AlbumType

  @ApiProperty({
    description: 'The artists of the track',
    type: [ArtistDto],
  })
  artists: ArtistDto[]

  @ApiProperty({
    description: 'The artwork of the track',
    type: ArtworkDto,
  })
  artwork: ArtworkDto
}

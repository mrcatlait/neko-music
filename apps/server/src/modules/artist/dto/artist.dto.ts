import { ApiProperty } from '@nestjs/swagger'

import { ArtistEntity } from '../entities'

import { ImageDto } from '@common/dto'

export class ArtistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty()
  readonly bio?: string

  @ApiProperty({ type: () => [ImageDto] })
  readonly images?: ImageDto[]

  constructor(artist: ArtistEntity) {
    this.id = artist.id
    this.name = artist.name
    this.bio = artist.bio
    this.images = artist.images?.map((image) => ({
      resolution: image.resolution,
      url: image.url,
    }))
  }
}

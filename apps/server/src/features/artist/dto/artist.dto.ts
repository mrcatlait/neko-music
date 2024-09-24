import { ApiProperty } from '@nestjs/swagger'

import { ArtistEntity } from '../entities'
import { LinkDto } from './link.dto'

import { ImageDto } from '@core/dto'

export class ArtistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty({ type: () => [ImageDto] })
  readonly images?: ImageDto[]

  @ApiProperty({ type: () => [LinkDto] })
  readonly links?: LinkDto[]

  constructor(artist: ArtistEntity) {
    this.id = artist.id
    this.name = artist.name
    this.images = artist.images?.map((image) => ({
      resolution: image.resolution,
      url: image.url,
    }))

    this.links = artist.links?.map((link) => ({
      type: link.type,
      url: link.url,
    }))
  }
}

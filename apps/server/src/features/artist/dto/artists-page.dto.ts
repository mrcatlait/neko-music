import { ApiProperty } from '@nestjs/swagger'

import { ArtistDto } from './artist.dto'

import { PageMetaDto } from '@core/dto'

export class ArtistsPageDto {
  @ApiProperty({
    type: () => ArtistDto,
    isArray: true,
  })
  readonly data: ArtistDto[]

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto

  constructor(data: ArtistDto[], meta: PageMetaDto) {
    this.data = data
    this.meta = meta
  }
}

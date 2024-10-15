import { ApiProperty } from '@nestjs/swagger'

import { PlaylistDto } from './playlist.dto'

import { PageMetaDto } from '@common/dto'

export class PlaylistPageDto {
  @ApiProperty({
    type: () => PlaylistDto,
    isArray: true,
  })
  readonly data: PlaylistDto[]

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto

  constructor(data: PlaylistDto[], meta: PageMetaDto) {
    this.data = data
    this.meta = meta
  }
}

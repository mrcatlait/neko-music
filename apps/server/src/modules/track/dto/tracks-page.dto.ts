import { ApiProperty } from '@nestjs/swagger'

import { TrackDto } from './track.dto'

import { PageMetaDto } from '@common/dto'

export class TracksPageDto {
  @ApiProperty({
    type: () => TrackDto,
    isArray: true,
  })
  readonly data: TrackDto[]

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto

  constructor(data: TrackDto[], meta: PageMetaDto) {
    this.data = data
    this.meta = meta
  }
}

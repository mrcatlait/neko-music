import { ApiProperty } from '@nestjs/swagger'

import { PageOptionsDto } from './page-options.dto'

interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto
  itemCount: number
}

export class PageMetaDto {
  @ApiProperty()
  readonly offset: number

  @ApiProperty()
  readonly take: number

  @ApiProperty()
  readonly itemCount: number

  @ApiProperty()
  readonly pageCount: number

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.offset = pageOptionsDto.offset
    this.take = pageOptionsDto.take
    this.itemCount = itemCount
    this.pageCount = itemCount ? Math.ceil(itemCount / this.take) : 0
  }
}

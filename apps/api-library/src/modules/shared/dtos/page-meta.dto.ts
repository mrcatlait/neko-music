import { ApiProperty } from '@nestjs/swagger'

import { PageOptionsDto } from './page-options.dto'

interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto
  hasMore: boolean
}

export class PageMetaDto {
  @ApiProperty()
  readonly offset: number

  @ApiProperty()
  readonly take: number

  @ApiProperty()
  readonly hasNext: boolean

  @ApiProperty()
  readonly hasPrevious: boolean

  constructor({ pageOptionsDto, hasMore }: PageMetaDtoParameters) {
    this.offset = pageOptionsDto.offset
    this.take = pageOptionsDto.take
    this.hasNext = hasMore
    this.hasPrevious = this.offset > 0
  }
}

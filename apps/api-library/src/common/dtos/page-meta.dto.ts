import { t } from 'elysia'

import { PageOptionsDto } from './page-options.dto'

export const pageMetaDto = t.Object({
  offset: t.Numeric(),
  take: t.Numeric(),
  hasNext: t.Boolean(),
  hasPrevious: t.Boolean(),
})

interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto
  hasMore: boolean
}

export class PageMetaDto {
  readonly offset: number
  readonly take: number
  readonly hasNext: boolean
  readonly hasPrevious: boolean

  constructor({ pageOptionsDto, hasMore }: PageMetaDtoParameters) {
    this.offset = pageOptionsDto.offset
    this.take = pageOptionsDto.take
    this.hasNext = hasMore
    this.hasPrevious = this.offset > 0
  }
}

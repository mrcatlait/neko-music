import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { PagePaginationQuery } from './page-pagination-query.dto'

interface PagePaginationMetadataParameters {
  query: PagePaginationQuery
  itemCount: number
}

export class PagePaginationMetadata implements Contracts.Shared.Dtos.PagePaginationMetadata {
  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  page: number

  @ApiProperty({
    description: 'The limit of the page',
    example: 10,
  })
  limit: number

  @ApiProperty({
    description: 'The item count',
    example: 100,
  })
  itemCount: number

  @ApiProperty({
    description: 'The page count',
    example: 10,
  })
  pageCount: number

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: true,
  })
  hasPreviousPage: boolean

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage: boolean

  constructor({ query, itemCount }: PagePaginationMetadataParameters) {
    this.page = query.page
    this.limit = query.limit
    this.itemCount = itemCount
    this.pageCount = Math.ceil(itemCount / query.limit)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}

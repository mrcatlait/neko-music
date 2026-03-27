import { ApiProperty } from '@nestjs/swagger'
import { JSONSchemaType } from 'ajv'

/**
 * The page pagination query DTO is used to paginate the results of a query.
 */
export class PagePaginationQuery {
  @ApiProperty({
    description: 'The page number',
    minimum: 1,
    default: 1,
    required: false,
  })
  readonly page: number = 1

  @ApiProperty({
    description: 'The limit of the page',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  readonly limit: number = 10

  get offset(): number {
    return (this.page - 1) * this.limit
  }
}

export const pagePaginationQuerySchema: JSONSchemaType<Omit<PagePaginationQuery, 'offset'>> = {
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1, required: false },
    limit: { type: 'number', minimum: 1, maximum: 100, default: 10, required: false },
  },
  required: ['page', 'limit'],
  additionalProperties: false,
}

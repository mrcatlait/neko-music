import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

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
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  readonly page: number = 1

  @ApiProperty({
    description: 'The limit of the page',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  readonly limit: number = 10

  get offset(): number {
    return (this.page - 1) * this.limit
  }
}

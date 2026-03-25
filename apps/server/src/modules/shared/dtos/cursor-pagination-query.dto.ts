import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

/**
 * The cursor pagination DTO is used to paginate the results of a query.
 */
export class CursorPaginationQuery {
  @ApiProperty({
    description: 'The cursor to the next page',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly cursor?: string

  @ApiProperty({
    description: 'The limit of the page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  readonly limit: number = 10
}

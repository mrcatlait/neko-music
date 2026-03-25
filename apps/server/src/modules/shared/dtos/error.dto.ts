// use problem details for error response

import { ApiProperty } from '@nestjs/swagger'

export class ErrorDto {
  @ApiProperty()
  readonly type: string

  @ApiProperty()
  readonly title: string

  @ApiProperty()
  readonly status: number

  @ApiProperty()
  readonly detail: string

  @ApiProperty()
  readonly instance: string
}

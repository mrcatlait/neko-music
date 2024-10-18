import { ApiProperty } from '@nestjs/swagger'

export class UserAccountDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly username: string

  @ApiProperty()
  readonly permissions: string[]
}

import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly username: string
}

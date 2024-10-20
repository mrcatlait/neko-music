import { ApiProperty } from '@nestjs/swagger'

import { UserAccountEntity } from '../entities'

export class UserDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly username: string

  constructor(user: UserAccountEntity) {
    this.id = user.id
    this.username = user.username
  }
}

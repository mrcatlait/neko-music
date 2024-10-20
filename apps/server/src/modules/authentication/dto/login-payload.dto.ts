import { ApiProperty } from '@nestjs/swagger'

import { UserAccountEntity } from '@modules/user/entities'
import { UserDto } from '@modules/user/dto'

export class LoginPayloadDto {
  @ApiProperty({ type: () => UserDto })
  readonly user: UserDto

  @ApiProperty({ type: () => [String] })
  readonly permissions: string[]

  constructor(user: UserAccountEntity) {
    this.user = new UserDto(user)
    this.permissions = user.role.permissions?.map((p) => p.action) || []
  }
}

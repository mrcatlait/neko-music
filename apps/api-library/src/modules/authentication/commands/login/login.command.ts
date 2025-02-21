import { Command } from '@nestjs/cqrs'

import { UserLoginDataEntity } from '@modules/authentication/entities'

export class LoginCommand extends Command<UserLoginDataEntity> {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {
    super()
  }
}

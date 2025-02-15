import { Controller, Get, Header } from '@nestjs/common'

import { LoginHandler } from '@modules/authentication/login/commands'
import { RegisterHandler } from '@modules/authentication/registration/commands'
import { Session } from '@modules/authentication/infrastructure/decorators'
import { UserSession } from '@modules/authentication/shared/interfaces'

@Controller('user')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly registerHandler: RegisterHandler,
  ) {}

  @Get('whoami')
  @Header('Cache-Control', 'no-store')
  whoami(@Session() session: UserSession): any {
    console.log(user)
    return { accessToken: '123' }
  }
}

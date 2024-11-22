import { LoginCommand, RegisterCommand } from '../commands'
import { Session } from '../models'

import { UserCommandService, UserQueryService } from '@features/user/service'
import { UnauthorizedException } from '@common/exceptions'
import { CryptoService } from '@core/services'
import { AuthorizationQueryService } from '@features/authorization/services'

export class AuthenticationCommandService {
  constructor(
    private readonly userCommandService: UserCommandService,
    private readonly userQueryService: UserQueryService,
    private readonly authorizationQueryService: AuthorizationQueryService,
    private readonly cryptoService: CryptoService,
  ) {}

  async login(command: LoginCommand) {
    const user = await this.userQueryService.getUserByEmail({ email: command.email })

    if (!user) {
      throw new UnauthorizedException()
    }

    const isMatch = this.cryptoService.compareHash(command.password, user.password_hash)

    if (!isMatch) {
      throw new UnauthorizedException()
    }

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      permissions: user.permissions,
    }
  }

  async register(command: RegisterCommand): Promise<Session> {
    const role = await this.authorizationQueryService.getDefaultRole()
    const user = await this.userCommandService.createUser({ ...command, roleId: role.id })

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      permissions: user.permissions,
    }
  }
}

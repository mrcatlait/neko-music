import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthenticationService } from '../services'

import { UserAccountEntity } from 'src/modules/user/entities'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly authenticationService: AuthenticationService

  constructor(authenticationService: AuthenticationService) {
    super({ usernameField: 'email' })

    this.authenticationService = authenticationService
  }

  async validate(username: string, password: string): Promise<UserAccountEntity> {
    const user = await this.authenticationService.validateUser(username, password)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}

import { JwtFromRequestFunction, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { REFRESH_TOKEN_COOKIE } from '../authentication.constant'

import { ConfigService } from '@core/services'
import { UserAccountService } from 'src/modules/user/services'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly userAccountService: UserAccountService

  constructor(userAccountService: UserAccountService, configService: ConfigService) {
    const fromCookie: JwtFromRequestFunction = (req: FastifyRequest) => {
      if (!req.cookies[REFRESH_TOKEN_COOKIE]) {
        return null
      }

      const cookie = req.unsignCookie(REFRESH_TOKEN_COOKIE)

      if (!cookie.valid) {
        return null
      }

      return cookie.value
    }

    super({
      jwtFromRequest: fromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtRefreshSecret'),
    })
    this.userAccountService = userAccountService
  }

  async validate(payload: any): User {
    const userAccount = await this.userAccountService.findById(payload.sub)

    if (!userAccount) {
      throw new UnauthorizedException()
    }

    return userAccount
  }
}

import { JwtFromRequestFunction, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { REFRESH_TOKEN_COOKIE } from '../constants'

import { UserAccountService } from 'src/modules/user/services'
import { UserAccountEntity } from 'src/modules/user/entities'
import { ConfigService } from '@shared/services'

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
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    })
    this.userAccountService = userAccountService
  }

  async validate(payload: any): Promise<UserAccountEntity> {
    const userAccount = await this.userAccountService.findById(payload.sub)

    if (!userAccount) {
      throw new UnauthorizedException()
    }

    return userAccount
  }
}

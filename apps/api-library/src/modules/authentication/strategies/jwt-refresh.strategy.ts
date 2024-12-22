import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from '@modules/shared/models'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly userService: UserService

  constructor(userService: UserService, configService: ConfigService<EnvironmentVariables, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      // signOptions: { expiresIn: configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') },
    })
    this.userService = userService
  }

  async validate(payload: any) {
    const authUser = await this.userService.findOne(payload.sub)
    if (!authUser) {
      throw new UnauthorizedException()
    }

    return {
      attributes: authUser,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    }
  }
}

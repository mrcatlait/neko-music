import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from '@modules/shared/models'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UserService

  constructor(userService: UserService, configService: ConfigService<EnvironmentVariables, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
    this.userService = userService
  }

  async validate(payload: any): Promise<User | null> {
    const authUser = await this.userService.findOne(payload.sub)
    if (!authUser) {
      throw new UnauthorizedException()
    }

    return authUser
  }
}

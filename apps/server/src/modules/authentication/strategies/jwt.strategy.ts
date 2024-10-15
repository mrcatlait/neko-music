import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { UserAccountService } from 'src/modules/user/services'
import { ConfigService } from '@core/services'
import { UserAccountEntity } from 'src/modules/user/entities'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userAccountService: UserAccountService

  constructor(userAccountService: UserAccountService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
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

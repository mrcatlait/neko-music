import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { UserAccountEntity } from 'src/modules/user/entities'
import { UserAccountService } from '@modules/user/services'
import { ConfigService } from '@shared/services'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userAccountService: UserAccountService

  constructor(userAccountService: UserAccountService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
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
